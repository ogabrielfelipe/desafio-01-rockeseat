import fs from 'node:fs';
import csv from 'csv-parser';


let tasks = []
const csvPath = new URL('tasks.csv', import.meta.url)

fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => tasks.push(data))
    .on('end', async () => {
       
        for await (const task of tasks) {
            
            const body = {                    
                title: task.title,
                description: task.description                   
            }

            fetch('http://localhost:3333/tasks', {
                method: 'POST',
                body: JSON.stringify(body),
                duplex: "half",
               }).then(response => {
                response.text().then(data => {
                    console.log(data)
                }).catch(err => {
                    console.log(err)
                })
            })
        }

        
    })


/*
const parser = parse({
    delimiter: ','
  });

fs.ReadStream(csvPath)

parser.on('readable', function(){
let record;
while ((record = parser.read()) !== null) {
    tasks.push(record);
}
});

parser.on('error', function(err){
    console.error(err.message);
  });

parser.on('end', function(){
    console.log(tasks)
});

*/