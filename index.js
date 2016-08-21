var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

var M = ['January','February','March','April','May','June','July','August','September','October','November','December']


function findMonth(string) {
    for(var i=0; i<M.length; i++) {
        if(string.search(M[i]) >= 0)    return i+1;
    }
    return 0;
}

function findDate(string) {
    var n = string.search(',');
    if(n >= 0)    {
        var d = string[n-2] + string[n-1]
        var date = parseInt(d);
        return date;
    }
    else return 0;
}

function findYear(string) {
    var n = string.search(',');
    var yString = string.substring(n, string.length);
    var n19 = yString.indexOf("19"),
        n20 = yString.indexOf("20");

    if(n19 > -1)    {
        var nn19 = parseInt('19' + yString[n19+2] + yString[n19+3]);
        if(nn19 > 1970) return nn19;
        else if(n20 > -1)  {
            var nn20 = parseInt('20' + yString[n20+2] + yString[n20+3]);
            if(nn20 < 2038) return nn20;
            else return -1;
        }
    }
    else if(n20 > -1)  {
        var nn20 = parseInt('20' + yString[n20+2] + yString[n20+3]);
        if(nn20 < 2038) return nn20;
        else return -1;
    }
    else return -1;
}

function getMonthNumber(string) {
    for(var i=0; i<M.length; i++) {
        if(string == M[i])  return i+1;
    }
}

function getMonthString(number) {
    return M[number];
}


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.get('/cool', function(request, response) {
  response.send(cool());
 
});

app.get("/:id", function(request, response) {
	var str = request.params.id;
	var unix, natural, d, m, y;
	
	if(findMonth(str)) {
	    m = findMonth(str);
		d = findDate(str);
        y = findYear(str);
	    natural = str;
	    unix = Math.round(new Date(m+'/'+d+'/'+y).getTime()/1000.0);
	
	    response.send("{\"unix\":" + unix.toString() + ", \"natural\":\"" +natural+ "\"}");
	}
	else if(parseInt(str).toString().length == str.length) {
	    unix = str;
	    var date = new Date(parseInt(str) * 1000);
	    d = date.getDate();
	    m = date.getMonth();
	    y = date.getFullYear();
	    natural = getMonthString(m) + " "+d.toString()+", "+y.toString();
	    
	    response.send("{\"unix\":" + unix + ", \"natural\":\"" +natural+ "\"}");
	}
	else response.send("{\"unix\":null,\"natural\":null}")  
		

});

app.get('/times', function(request, response) {
    var result = ''
    var times = process.env.TIMES || 5
    for (i=0; i < times; i++)
      result += i + ' ';
  	response.send(result);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


