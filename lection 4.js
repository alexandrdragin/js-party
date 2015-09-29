
xhr.onload()
xhr.onloadstart
xhr.onloadend

xhr.onabort
xhr.onerror
xhr.ontimeout = (function () {}, 10);
xhr.onreadystatechange

var pr = fetch('get', 'data/reviews.json');
pr.then(function(){действие})..then(function(){след. действие}).

[array].sort(function(a, b){
if (parseInt(a, 10) < parseInt(b, 10)) { return -1; };
if (a=b){return 0;};
if (parseInt(a, 10) > parseInt(b, 10)) { return 1; };
});   сортировка по возрастанию

[{ a: 1 }, { a: 2 } ].sort(function(a, b){
if (a.a > b.a) {return -1;}
if (a.a < b.a) {return 1;}
if (a.a === b.a) {return 0;}
});


[array].sort(); сортировка по строкам


[array].filter(function(){
return item >3
});  возвращает все значения >3

{}.toString привести к строке
