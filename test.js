function step(n, callback) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("N IS", n)
            let err = n > 5;

            // DO NOT DO CALLBACK IN SQL, ALREADY IS CALLBACK
            if (callback) {
                callback(n);
                return;
            }
            
            if (err) {
                return reject(err);
            } else {
                return resolve(n);
            }
        }, 3000)
    });
}

function callback(n) {
    console.log("CALLBACK EXAMPLE", n);
}

step(1, callback);

async function main() {
    try {
        let x = await step(1);
        console.log("ASYNC AWAIT", x)
    } catch(e) {
        console.log(e);
    }
}

step(1)
    .then((ret) => {
        console.log("PROMISE IS", ret);
        return step(2);
    })
    .then(x2 => {
        console.log("PROMISE AGAIN", x2)
        // STEP 6 WILL TRIGGER ERROR
        return step(3);
    })
        // ASYNC AWAIT EXAMPLE JUST WAITING FOR PROMISES FIRST
    .then(() => {
        main()
    })
    .catch(err => {
        console.error("MY ERR WAS", err);
    });
	
// an example of converting a sql query into an async promise	
	module.exports.checkUserExists = function (email) {
	    return new Promise(function (resolve, reject) {
	        let qs = `SELECT email, salt, pwhash FROM bpi_user_auth WHERE email = ? OR username = ?`;
	        return db.getPool().query(qs, [email, email], function (err, rows, fields) {
	            if (!!err) {
	                return reject(err);
	            } else if (rows.length == 0) {
	                return resolve(false)
	            } else {
	                return resolve(true);
	            }
	        });
	    });
	}