const pool = require('../config/db');

exports.getSkills = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skills ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyScores = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ss.id, s.name as skill_name, s.category, ss.test_score, ss.assignment_score, ss.quiz_score,
              ss.total_score, ss.assessment_type
       FROM skill_scores ss
       JOIN skills s ON ss.skill_id = s.id
       WHERE ss.user_id = $1
       ORDER BY s.name`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHeatmapData = async (req, res) => {
  try {
    let query;
    let params = [];

    if (req.user.role === 'student') {
      query = `SELECT u.name as student_name, s.name as skill_name, s.category, ss.total_score
               FROM skill_scores ss
               JOIN users u ON ss.user_id = u.id
               JOIN skills s ON ss.skill_id = s.id
               WHERE ss.user_id = $1
               ORDER BY u.name, s.name`;
      params = [req.user.id];
    } else {
      query = `SELECT u.name as student_name, s.name as skill_name, s.category, ss.total_score
               FROM skill_scores ss
               JOIN users u ON ss.user_id = u.id
               JOIN skills s ON ss.skill_id = s.id
               WHERE u.role = 'student'
               ORDER BY u.name, s.name`;
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const scores = await pool.query(
        `SELECT s.name as skill_name, s.category, ss.total_score, ss.test_score, ss.assignment_score, ss.quiz_score
         FROM skill_scores ss JOIN skills s ON ss.skill_id = s.id
         WHERE ss.user_id = $1 ORDER BY s.name`,
        [req.user.id]
      );

      // Get class averages per skill for comparison
      const classAvg = await pool.query(
        `SELECT s.name as skill_name, ROUND(AVG(ss.total_score)) as class_avg
         FROM skill_scores ss
         JOIN skills s ON ss.skill_id = s.id
         JOIN users u ON ss.user_id = u.id
         WHERE u.role = 'student'
         GROUP BY s.name
         ORDER BY s.name`
      );

      const classAvgMap = {};
      classAvg.rows.forEach(r => { classAvgMap[r.skill_name] = parseInt(r.class_avg); });

      const scoresWithAvg = scores.rows.map(s => ({
        ...s,
        class_avg: classAvgMap[s.skill_name] || 0
      }));

      const avg = scores.rows.length > 0
        ? Math.round(scores.rows.reduce((sum, r) => sum + r.total_score, 0) / scores.rows.length)
        : 0;
      const best = scores.rows.length > 0
        ? scores.rows.reduce((max, r) => r.total_score > max.total_score ? r : max).skill_name
        : 'N/A';
      const weakest = scores.rows.length > 0
        ? scores.rows.reduce((min, r) => r.total_score < min.total_score ? r : min).skill_name
        : 'N/A';

      // Overall class avg
      const overallClassAvg = await pool.query(
        `SELECT ROUND(AVG(ss.total_score)) as avg FROM skill_scores ss JOIN users u ON ss.user_id = u.id WHERE u.role = 'student'`
      );

      res.json({
        totalSkills: scores.rows.length,
        averageScore: avg,
        classAverage: parseInt(overallClassAvg.rows[0].avg) || 0,
        bestSkill: best,
        weakestSkill: weakest,
        scores: scoresWithAvg
      });
    } else {
      const students = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
      const skills = await pool.query('SELECT COUNT(*) as count FROM skills');
      const avgResult = await pool.query('SELECT ROUND(AVG(total_score)) as avg FROM skill_scores');

      const topStudents = await pool.query(
        `SELECT u.name, ROUND(AVG(ss.total_score)) as avg_score
         FROM skill_scores ss JOIN users u ON ss.user_id = u.id
         WHERE u.role = 'student'
         GROUP BY u.name ORDER BY avg_score DESC LIMIT 5`
      );

      // Low performers
      const lowPerformers = await pool.query(
        `SELECT u.name, s.name as skill_name, ss.total_score
         FROM skill_scores ss
         JOIN users u ON ss.user_id = u.id
         JOIN skills s ON ss.skill_id = s.id
         WHERE u.role = 'student' AND ss.total_score < 50
         ORDER BY ss.total_score ASC LIMIT 5`
      );

      res.json({
        totalStudents: parseInt(students.rows[0].count),
        totalSkills: parseInt(skills.rows[0].count),
        averageScore: parseInt(avgResult.rows[0].avg) || 0,
        topStudents: topStudents.rows,
        lowPerformers: lowPerformers.rows
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClassPerformance = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.name as skill_name, 
              ROUND(AVG(ss.total_score)) as avg_score,
              MIN(ss.total_score) as min_score,
              MAX(ss.total_score) as max_score,
              COUNT(ss.id) as student_count
       FROM skill_scores ss
       JOIN skills s ON ss.skill_id = s.id
       JOIN users u ON ss.user_id = u.id
       WHERE u.role = 'student'
       GROUP BY s.name
       ORDER BY s.name`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = [];
    if (req.user.role === 'student') {
      const low = await pool.query(
        `SELECT s.name as skill_name, ss.total_score
         FROM skill_scores ss JOIN skills s ON ss.skill_id = s.id
         WHERE ss.user_id = $1 AND ss.total_score < 50
         ORDER BY ss.total_score ASC`,
        [req.user.id]
      );
      low.rows.forEach(r => {
        alerts.push({
          type: 'critical',
          message: `${r.skill_name} score is critically low at ${r.total_score}%`,
          skill: r.skill_name,
          score: r.total_score
        });
      });

      const belowAvg = await pool.query(
        `SELECT s.name as skill_name, ss.total_score, ROUND(AVG(ss2.total_score)) as class_avg
         FROM skill_scores ss
         JOIN skills s ON ss.skill_id = s.id
         JOIN skill_scores ss2 ON ss2.skill_id = ss.skill_id
         JOIN users u ON ss2.user_id = u.id AND u.role = 'student'
         WHERE ss.user_id = $1 AND ss.total_score >= 50
         GROUP BY s.name, ss.total_score
         HAVING ss.total_score < ROUND(AVG(ss2.total_score)) - 10`,
        [req.user.id]
      );
      belowAvg.rows.forEach(r => {
        alerts.push({
          type: 'warning',
          message: `${r.skill_name} is ${parseInt(r.class_avg) - r.total_score} points below class average`,
          skill: r.skill_name,
          score: r.total_score
        });
      });
    } else {
      const struggling = await pool.query(
        `SELECT u.name, COUNT(*) as low_count
         FROM skill_scores ss JOIN users u ON ss.user_id = u.id
         WHERE u.role = 'student' AND ss.total_score < 50
         GROUP BY u.name
         HAVING COUNT(*) >= 2
         ORDER BY low_count DESC`
      );
      struggling.rows.forEach(r => {
        alerts.push({
          type: 'critical',
          message: `${r.name} has ${r.low_count} skills below 50%`,
          student: r.name,
          count: parseInt(r.low_count)
        });
      });
    }
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
