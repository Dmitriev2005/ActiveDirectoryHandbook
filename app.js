import AD from "activedirectory"
import express from "express"
import 'dotenv/config'
const app = express()

console.log(process.env.ADMIN)
const newAD =  new AD('ldap://my.ru','ou=users,ou=gai,ou=organization,dc=my,dc=ru',process.env.ADMIN,process.env.PASSWORD,{attributes: {user: [ 'cn','displayName','userPrincipalName', 'department', 'title', 
'telephoneNumber', 'otherTelephone', 'mobile', 'otherMobile', 'homePhone', 'facsimileTelephoneNumber','mail','ipPhone','department','postalCode','company']}})

let users = []

app.set("view engine","ejs")
app.get("/",(req,res)=>{     
    res.status(200).render("index")
})
app.get("/json",(req,res)=>{
    try{
        const usersProm = new Promise((resolve,reject)=>{
             newAD.findUsers((err,user)=>{
                if(err){
                    console.log(err)
                    return
                }
                resolve(user)
               
            })
        }).then(user=>{
            users = []
            user.forEach(element => {
                users.push(element)
            })
            res.status(200).json(users)
        })
    }catch(error){
        console.error("Error")
        res.status(500).json({error:"Error fetching"})
    }
})


app.listen(8000)
