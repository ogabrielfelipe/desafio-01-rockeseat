import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './util/build-route-path.js';
import { formatedTimestamp } from './util/formate-date.js';

const database = new Database()


export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body;
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: formatedTimestamp(),
                updated_at: null
            }

            database.insert('tasks', task)
            return res.writeHead(201).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            database.delete('tasks', id)
            return res.writeHead(204).end()
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const task = database.select('tasks', {
                id
            })[0]

            if (!task){
                return res.writeHead(404).end('Task not found.')
            }

            task.completed_at = task.completed_at != null ? null : formatedTimestamp(),
            task.updated_at = formatedTimestamp()
            
            database.update('tasks', id, task)

            return res.writeHead(200).end(JSON.stringify(task))

        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body


            const task = database.select('tasks', {
                id
            })[0]

            if (!task){
                return res.writeHead(404).end('Task not found.')
            }

            

            task.title = !title ? task.title : title 
            task.description = !description ? task.description : description

            task.updated_at = formatedTimestamp()
            
            database.update('tasks', id, task)

            return res.writeHead(200).end(JSON.stringify(task))
        }
    }

]