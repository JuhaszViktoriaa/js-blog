import express from 'express'
import * as database from './utility/database.js'

const PORT = 8080
const app=express()
app.use(express.json())

const user = [
    {szerzo: "a", cim: "aaa", kategoria: "alma", tartalom: "...", kelt: "2023", modositas: "2024"}
    {szerzo: "b", cim: "bbb", kategoria: "barack", tartalom: "...", kelt: "2024", modositas: "2025"}
    {szerzo: "c", cim: "ccc", kategoria: "citrom", tartalom: "...", kelt: "2025", modositas: "-"}
]

app.get('/users', (req, res) => {
    try {
        const users = database.getUsers()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({message: `${error}`})
    }
})
app.get('/users:id', (req, res) => {
    try {
        const user = database.getUser(req.params.id)
        if(!user){
            return res.status(404).json({message: 'nincs ilyen felhasznalo'})
        }
    } catch (error) {
        res.status(500).json({message: `${error}`})
    }
})
app.post('/users', (req, res) => {
    try {
        const {szerzo, cim} = req.body
        if(!szerzo || !cim){
            return res.status(400).json({message: 'invalid credentials'})
        }
        const savedUser = database.saveUser(szerzo, cim)
        if(savedUser.changes != 1){
            return res.status(501).json({message: 'a felhasznalot nem sikerult menteni.'})
        }
        res.status(201).json({id:savedUser.lastInsertRowid, szerzo, cim})
    } catch (error) {
        res.status(500).json({message: `${error}`})
    }
})
app.put('/users:id', (req, res) => {
    try {
        const {szerzo, cim} = req.body
        if(!szerzo || !cim){
            return res.status(400).json({message: 'invalid credentials'})
        }
        const id= +req.params.id
        const updatedUser = database.updateUser(id, szerzo, cim)
        if(updatedUser.changes != 1){
            return res.status(501).json({message: 'a felhasznalot nem sikerult menteni.'})
        }
        res.status(201).json({id, szerzo, cim})
    } catch (error) {
        res.status(500).json({message: `${error}`})
    }
})
app.delete('/users:id', (req, res) => {
    try {
        const deletedUser = database.deleteUser(req.params.id)
        if(deletedUser.changes != 1){
            return res.status(501).json({message: 'nem sikeres a torles'})
        }
        res.status(200).json({message: 'sikeres torles'})
    } catch (error) {
        res.status(500).json({message: `${error}`})
    }
})

app.listen(PORT, () => {
    console.log(`a szerver a ${PORT} -on fut`)
})