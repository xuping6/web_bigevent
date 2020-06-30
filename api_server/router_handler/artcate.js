// 导入数据库操作模块
const db = require("../db/index");

// 获取文章分类列表数据的处理函数
exports.getArticleCates = (req, res) => {
  // 定义 SQL 语句 -- 根据分类的状态，获取所有未被删除的分类列表数据 0 表示没有被标记删除
  const sql = "select * from ev_article_cate where is_delete=0 order by id asc";
  db.query(sql, (err, results) => {
    // 执行 SQL 失败
    if (err) {
      return res.cc(err);
    }
    // 执行成功
    res.send({
      status: 0,
      message: "获取文章分类列表数据成功",
      data: results,
    });
  });
};

// 新增文章分类
exports.addArticleCates = (req, res) => {
  // 1. 定义 SQL 语句
  const sql = "select * from ev_article_cate where name=? or alias=?";
  const { name, alias } = req.body;
  // 2. 执行查重失败
  db.query(sql, [req.body.name, req.body.alias], (err, results) => {
    // 3. 执行 SQL 失败
    /*  if (err) {
      return res.cc(err);
    }
    // 4.1 判断分类名称 和 分类别名 是否被占用
    if (results.length === 2) {
      return res.cc("分类名称和分类别名被占用，请更换后重试");
    }
    // 4.2 length 等于 1 的三种情况
    if (
      results.length === 1 &&
      results[0].name === req.body.name &&
      results[0].alias === req.body.alias
    ) {
      return res.cc("分类名称和分类别名被占用，请更换后重试");
    }
    // 分别判断---分类名称 是否被占用
    if (results.length === 1 && results[0].name === req.body.name) {
      return res.cc("分类名称 被占用，请更换后重试");
    }
    // 分别判断---分类别名 是否被占用
    if (results.length === 1 && results[0].alias === req.body.alias) {
      return res.cc("分类别名 被占用，请更换后重试");
    } */

    // 优化代码

    if (err) return res.cc(err);
    if (results.length === 2)
      return res.cc("分类名称和分类别名被占用，请更换后重试");
    if (results.length === 1) {
      const { name: cName, alias: cAlias } = results[0];
      if (cName === name && cAlias === alias) {
        return res.cc("分类名称和分类别名被占用，请更换后重试");
      } else if (cName === name) {
        return res.cc("分类名称 被占用，请更换后重试");
      } else if (cAlias === alias) {
        return res.cc("分类别名 被占用，请更换后重试");
      }
    }
    //  新增文章分类
    const sql = "insert into ev_article_cate set ?";
    db.query(sql, req.body, (err, results) => {
      //   执行 SQL 语句失败
      if (err) {
        return res.cc(err);
      }
      //   执行 SQL 成功，但是影响行数不等于1
      if (results.affectedRows !== 1) {
        return res.cc("新增文章分类失败！");
      }
      // 新增成功
      res.cc("新增文章分类成功！", 0);
    });
  });
};

// 删除文章分类
exports.deleteCateById = (req, res) => {
  // 定义标记删除/软删除/逻辑删除的 SQL 语句
  const sql = "update ev_article_cate set is_delete=1 where id=?";
  db.query(sql, req.params.id, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err);
    // 执行成功，但是影响行数不等于1
    if (results.affectedRows !== 1) return res.cc("删除文章分类失败");
    // 删除文章分类成功
    res.cc("删除文章分类成功", 0);
  });
};

// 根据 id 获取文章分类数据
exports.getArticleById = (req, res) => {
  const sql = "select * from ev_article_cate where id=?";
  db.query(sql, req.params.id, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err);
    // 执行成功，但是查询到的数据条不等于1
    if (results.length !== 1) return res.cc("获取文章分类数据失败");
    // 获取成功
    res.send({
      sattus: 0,
      message: "获取文章分类数据成功",
      data: results[0],
    });
  });
};

// 根据 id 更新文章分类
exports.updateCateById = (req, res) => {
  // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
  const sql =
    "select * from ev_article_cate where id!=? and(name=? or alias=?)";
  const { id, name, alias } = req.body;
  db.query(sql, [id, name, alias], (err, results) => {
    // 执行 sql 失败
    if (err) return res.cc(err);
    // 判断 分类名称 与 分类别名 是否被占用
    if (results.length === 2)
      return res.cc("分类名称与分类别名被占用，请更换后重试！");
    if (results.length === 1) {
      const { name: cName, alias: cAlias } = results[0];
      if (cName === name && cAlias === alias) {
        return res.cc("分类名称与分类别名被占用，请更换后重试！");
      } else if (cName === name) {
        return res.cc("分类名称被占用，请更换后重试");
      } else if (cAlias === alias) {
        return res.cc("分类别名被占用，请更换后重试！");
      }
    }
    // 更新文章分类
    const sql = "update ev_article_cate set? where id =?";
    db.query(sql, [req.body, req.body.id], (err, results) => {
      // 执行 SQL 语句失败
      if (err) return res.cc(err);
      // 执行成功，但是影响行数不等于1
      if (results.affectedRows !== 1) return res.cc("更新文章分类失败");
      // 更新文章分类成功
      res.cc("更新文章分类成功", 0);
    });
  });
};
