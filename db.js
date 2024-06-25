const sqlite3 = require('sqlite3');

console.log(process.env.TMPDIR)
const dbname = 'mysqlite';
// 创建并连接一个数据库
const db = new sqlite3.Database(dbname)

// 创建一个articles表
db.serialize(() => {
    const sql = `
        CREATE TABLE IF NOT EXISTS articles
        (id integer primary key,title,content TEXT)
    `;
    // 如果没有articles表,创建一个
    db.run(sql);
});

// Articles API
class Articles {
    // 获取所有文章
    static all(cb) {
    	// 使用sqlite3的all
        db.all('SELECT * FROM articles', cb);
    }
    // 根据id 获取文章
    static find(id, cb) {
    	// 使用sqlite3的get
        db.get('SELECT * FROM articles WHERE id = ?', id,cb);
    }
    // 添加一个条文章记录
    static create(data, cb) {
        const sql = `
                INSERT INTO 
                articles(title,content) 
                VALUES(?,?) 
                ;select last_insert_rowid();`;
        db.run(sql, data.title, data.content, cb);
    }
    // 删除一篇文章
    static delete(id, cb) {
        if (!id) return cb(new Error(`缺少参数id`));
        db.run('DELETE FROM articles WHERE id=?', id, cb)
    }
    // 更新一篇文章数据
    static update(data, cb) {
        const sql = `
            UPDATE articles
            SET title=?,content=?
            WHERE id=?
        `
        db.run(sql, data.title, data.content, data.id, cb)
    }
}
module.exports.Articles = Articles;
