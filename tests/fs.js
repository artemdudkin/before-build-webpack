var fs = require("fs");
var path = require("path");
var extra_fs = require("fs.extra");

const make_folder = function(f){
	try{ fs.mkdirSync(f) } catch(e) { if ( e.code != 'EEXIST' ) throw e; }
}

const del_folder = function(f){
	if (fs.existsSync(f)) {
		extra_fs.rmrfSync(f);
	}
}

const del_file = function(file){
	if (fs.existsSync(file)) fs.unlinkSync(file);
}

//@returns Promise
const copy_files = function(fromFolder, toFolder){
	return new Promise(function(resolve, reject){
		extra_fs.copyRecursive(fromFolder, toFolder, function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
        })
}

//@returns Promise
const copy_file = function(filePath, toFolder){
	return new Promise(function(resolve, reject){
		extra_fs.copy(filePath, toFolder, { replace: true }, function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

const replace_at_file = function(file, pattern_to_be_replaced, replacement){
	const data = fs.readFileSync(file, 'utf8');
	var result = data.replace(pattern_to_be_replaced, replacement);
	fs.writeFileSync(file, result, 'utf8');
}

module.exports = { del_folder, make_folder, del_file, copy_files, copy_file, replace_at_file }
