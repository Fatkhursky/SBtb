const notes = [{
  title: 'c',
  body: 'I would like to go spain'
}, {
  title: 'b',
  body: 'Exercise, eating a bit better' 
}, {
  title: 'a',
  body: 'Get a new seat'
}]

const sortNotes = function (notes) {
  notes.sort(function (a, b){
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return -1
    }
    if (b.title.toLowerCase() < a.title.toLowerCase()) {
      return 1
    }
    else {
      return 0
    }
  }) 
}

sortNotes(notes)
console.log(notes)
console.log('a' < 'b')
console.log('b' < 'a')