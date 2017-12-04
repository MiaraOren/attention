const crypto = require('crypto');
crypto.DEFAULT_ENCODING = 'hex';

var mysql = require('mysql');

var Connection;

Connection = function(domain, user, password, database) {
    this._domain = domain;
    this._user = user;
    this._password = password;
    this._database = database;
    this._isConnected = false;
    this._Connection = null;
}

Connection.prototype.getDomain = function () {return this._domain;};

Connection.prototype.getUser = function (x) {return this._user;};

Connection.prototype.getPassword = function () {return this._password;};

Connection.prototype.getDatabase = function () {return this._database;};

Connection.prototype.getConnection = function() {
    try {
        this._Connection = mysql.createConnection({
            domain: this.getDomain(),
            user: this.getUser(),
            password: this.getPassword(),
            database: this.getDatabase()
        });
       
    } catch(e) {
        console.log('unable to connect');
    }
    return this;
}

Connection.prototype.Connect = function() {
    
    if (!this._isConnected) {
        let self = this;
        this._Connection.connect(function(err) {
            this._isConnected = true;

            if (err) {
                console.log('unable to connect', err);
            } else {
                console.log("Connected to database!");
                try {
                    self._Connection.query('SELECT * FROM students;', function (error, results, fields) {
                        //console.log('The solution is: ', results);
                        //console.log('The solution is: ', fields);   
                    });
                } catch(e) {
                    //console.log('unable to query this', e);
                }
            }
        });
    } else {
        console.log("Already connected");
    }
}
//let u = `(SHA(NOW()+UUID()), '${username}', SHA2('${password}', 256), NOW())`

Connection.prototype.addNewUser = function(username, password) {

    var q = "INSERT INTO Students VALUES ";
    let self = this._Connection;
    
    crypto.randomBytes(16, (err, buf) => {
        if (err) {
            throw err;
        }
        let salt = buf.toString('hex');
        const key = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256');
        q += `(SHA(NOW()+UUID()), '${username}', '${salt}', '${key}', NOW())`;
    });   

    this._Connection.beginTransaction(function(err) {
        if (err) { throw err; }

        self.query(q, function (error, results, fields) {
          if (error) {
            return self.rollback(function() {
              throw error;
            });
          }
      
          self.commit(function(err) {
              if (err) {
                return self.rollback(function() {
                    throw err;
                });
              }
              console.log('success!');
            });
        });
    });
}


Connection.prototype.checkUser = async function(username, password, cb) {
  
    let q = "SELECT username, pass, salt from Students WHERE username=";
    q += `'${username}'`;

    this._Connection.query(q, function (err, result, fields)  {
        if (err) throw err;
        
        try {

            if (result[0].username === username) {
   
                if(_checkPassword(result[0].pass, result[0].salt, password)) {
                    console.log(`User ${username} has logged in`);
                    cb(null, true);
                } else {
                    cb("Wrong password", null);
                }

            } else {

            }

        } catch(e) {
            cb("No such user", null);
        }


    });

}

var _checkPassword = function(acutal_key, salt, to_check_key) {
    
    if (crypto.pbkdf2Sync(to_check_key, salt, 10000, 32, 'sha256') === acutal_key) {
        return true;
    }
    return false;
}

module.exports = {
    Connection: Connection
}



