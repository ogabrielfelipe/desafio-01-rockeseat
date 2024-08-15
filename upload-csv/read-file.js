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
