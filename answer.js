people = []; 

$('.team').each(function(index, item){

  name = $(item).find('h5').text();
  title = $(item).find('.subtitle').text();
  people.push({name: name, title: title});
});

people = people.sort(function(a, b) {
  if (a.name > b.name) {
    return 1;
  } else {
  return -1;
  }
});


$('.team').each(function(index, item){ 
  $(item).find('h5').text(people[index].name)
  $(item).find('.subtitle').text(people[index].title)
});