import cors from 'cors';
import { TClient, TProduct, TPurchase, TProductsInPurchase, TPurchasesProducts} from "./types";
import express, { Request, Response } from "express";
import { db } from "./database/knex";

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log("Servidor rodando localhost 3003");
});

app.get('/ping',(req: Request, res:Response)=>{
    res.send('Pong!')
})

app.post('/clients', async(req:Request,res:Response)=>{
    try {

    const {id, name, email, password } = req.body

        if (id !== undefined){
            
        if (typeof id !== "string"){
         res.status(400);
                throw new Error ("'Id' precisa ser uma string");
        }

        } else {
            res.status(400);
            throw new Error ("Cliente precisa ter uma 'ID'");
        }

        if (name !== undefined){
            
            if (typeof name !== "string"){
             res.status(400);
                    throw new Error ("'Id' precisa ser uma string");
            }
    
            } else {
                res.status(400);
                throw new Error ("Cliente precisa ter uma 'ID'");
            }

        if (email !== undefined){
            if (typeof email !== "string"){
                res.status(400);
                throw new Error ("E-mail do cliente precisa ser um string");
            }

        } else {
            res.status(400);
            throw new Error ("É necessário cadastrar um e-mail");
        }

        if (password !== undefined){
            if (typeof password !== "string"){
                res.status(400);
                throw new Error ("Password do cliente deve ser uma string");
            }
        } else {
            res.status(400);
            throw new Error ("É necessário cadastrar uma senha");
        }

        const [searchClientbyEmail] = await db("clients").where({email})

        if(searchClientbyEmail){
            res.status(400)
            throw new Error("'E-mail' já cadastrado.")
        }

        const newClient:TClient ={
            id,
            name,
            email,
            password,
        }

        await db("clients").insert(newClient)
    res.status(201).send('Cliente cadastrado com sucesso!')
    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
                
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        } 
        
    }

})

app.get('/clients', async(req:Request, res:Response)=>{
    try {

        const result = await db("clients")
        res.status(200).send(result) 

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
                
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }      
    }
    
})

app.get('/clients/:id', async(req:Request, res:Response)=>{
    try {
        const id = req.params.id

        const [filterUser] = await db("clients").where({id:id})

        if(!filterUser){
            res.status(404)
            throw new Error("Cliente não encontrado!")
        }else{
            res.status(200).send(filterUser)
        }
        
    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
                
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }  
    }

})

app.get('/clients/:id/purchases',async(req:Request, res:Response)=>{
    const id = req.params.id
    try{
           
        const result = await db("purchases").where({buyer_id:id})
        res.status(200).send(result)  

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
                
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }      
    }
})

app.put('/clients/:id', async (req:Request, res:Response)=>{
    try {     
    const id = req.params.id   
    const newId = req.body.id as string | undefined
    const newEmail = req.body.email as string | undefined
    const newName = req.body.name as string | undefined
    const newPass = req.body.password as string | undefined
    const [filterUser]: TClient[] | undefined[]= await db("clients").where({id:id})

    if (newEmail !== undefined){
        if (typeof newEmail !== "string"){
            res.status(400);
            throw new Error ("'Email' deve ser uma string");
        }
    }

    if (newName !== undefined){
        if (typeof newName !== "string"){
            res.status(400);
            throw new Error ("'Name' deve ser uma string");
        }
    }

    if (newPass !== undefined){
        if (typeof newPass !== "string"){
            res.status(400);
            throw new Error ("'Password' deve ser uma string");
        }
    }
    
    if(filterUser){

        const updateClient:TClient={
            id: newId || filterUser.id,
            email: newEmail || filterUser.email,
            name: newName || filterUser.name,
            password: newPass || filterUser.password,
        }

        await db("clients").update(updateClient).where({id:id})

        res.status(200).send({message:"Atualização realizada com sucesso!", client: updateClient })
    }else{
        res.status(404);
        throw new Error ("Cliente não localizado!");
    }

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
                
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }          
    }

})

app.delete('/clients/:id', async(req:Request, res:Response)=>{
    try {
        const id = req.params.id
        const [filterDeleteUser]:TClient[] | undefined[] = await db("clients").where({id:id})
    
        if(filterDeleteUser){
            await db("clients").del().where({id:id})
            res.status(200).send({message:"Cliente excluido com sucesso!",client:filterDeleteUser})
        }else{
            res.status(400)
            throw new Error("Cliente não localizado")
        }
    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
                
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }  
        
    }    
})

app.post('/products', async (req:Request, res:Response)=>{
    try {
        const {id,name,price,description,image_url} = req.body

        const newProduct:TProduct = {
            id,
            name,
            price,
            description,
            image_url,
        }

        await db("products").insert(newProduct)

        res.status(201).send({message:'Produto cadastrado com sucesso!', product: newProduct})
        
    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
                
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }  
    }
})

app.get('/products', async (req:Request, res:Response)=>{
    try {
        const result = await db("products")
        res.status(200).send(result) 

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
                
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }   
    }
})

app.get('/products/search', async (req:Request, res:Response)=>{
try {
    const q = req.query.q as string;

        if (q !== undefined){
            if (q.length < 1){
                res.status(400);
                throw new Error ("'q' deve possuir ao menos um caracter");
            }
        } else {
            res.status(400);
            throw new Error ("'q' precisa ser definido");
        }

    const result = await db("products").where({id:q})
    res.status(200).send(result);
    
} catch (error) {
    console.log(error)

    if(res.statusCode === 200){
        res.status(500)
    }
            
    if (error instanceof Error) {
        res.send(error.message)
    } else {
        res.send("Erro inesperado")
    } 
}    
})

app.put('/products/:id', async (req:Request, res:Response)=>{
    try {
    const id = req.params.id
    const newId = req.body.id as string | undefined
    const newName = req.body.name as string | undefined
    const newPrice = req.body.price as number | undefined
    const newDescription = req.body.description as string | undefined
    const newImage = req.body.image_url as string | undefined
    const [filterProd]: TProduct[] | undefined[] = await db("products").where({id:id})

    if (newName !== undefined){
        if (typeof newName !== "string"){
            res.status(400);
            throw new Error ("Valor inválido! Nome do cliente precisa ser String");
        }
    }

    if (newPrice !== undefined){
        if (typeof newPrice !== "number"){
            res.status(400);
            throw new Error ("Valor inválido! Preço do produto precisa ser um numero");
        }
    }

    if (newDescription !== undefined){
        if (typeof newDescription !== "string"){
            res.status(400);
            throw new Error ("Valor inválido! Descrição do produto precisa ser string");
        }
    }

    if(filterProd){
        const updateProd:TProduct={
            id: newId || filterProd.id,
            name: newName || filterProd.name,
            description: newDescription || filterProd.description,
            price: newPrice || filterProd.price,
            image_url: newImage || filterProd.image_url
        }

        await db("products").update(updateProd).where({id:id})
        res.status(200).send({message:"Atualização realizada com sucesso!", product: updateProd})
   
    }else{
        res.status(404);
        throw new Error ("Produto não localizado!");
    }
        
    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
                
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }       
    }
})

app.get('/products/:id', async(req:Request, res:Response)=>{
    try {

        const id = req.params.id
        const result = await db("products").where({id:id})
 
        res.status(200).send(result)
        
    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
                
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }  
    }

})

app.delete('/products/:id', async(req:Request, res:Response)=>{
    try {
        const id = req.params.id
        const [filterProd]: TProduct[] | undefined[] = await db("products").where({id:id})
        
        if(filterProd){
            await db("products").del().where({id:id})
            res.status(200).send({message:"Produto excluido com sucesso",product: filterProd})
        }else{
            res.status(400)
            throw new Error("Produto não localizado!")
        }
        
    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
                
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }   
    }

})

app.post('/purchase', async (req:Request, res:Response)=>{
    try {
        const {id,total_price,paid,buyer_id, products} = req.body
        const [filterUser]:TClient[] | undefined[] = await db("clients").where({id:buyer_id})
       
        if (id !== undefined){
            if (typeof id !== "string"){
                res.status(400);
                throw new Error ("Id do usuário precisa ser uma string");
            }
            
        } else {
            res.status(400);
            throw new Error ("Favor, inserir id de usuário.");
        }

        if (total_price !== undefined){
            if (typeof total_price !== "number"){
                res.status(400);
                throw new Error ("Valor de Preço Total inválido! Favor, informar um numero.");
            }

        } else {
            res.status(400);
            throw new Error ("Valor final da compra não informado.");
        }

        if (paid !== undefined){
            if (typeof paid !== "number"){
                res.status(400);
                throw new Error ("Confirmação de compra inválido! Favor, informar um numero.");
            }

        } else {
            res.status(400);
            throw new Error ("Confirmação de compra não informado.");
        }

        if (buyer_id === undefined){
            res.status(400);
            throw new Error ("Id de cliente não informado.");
        }

        if (total_price !== undefined){
            if (typeof total_price !== "number"){
                res.status(400);
                throw new Error ("Valor de Preço Total inválido! Favor, informar um numero.");
            }

        } else {
            res.status(400);
            throw new Error ("Valor final da compra não informado.");
        }

        if (products[0].id !== undefined){
            if (typeof products[0].id !== "string"){
                res.status(400);
                throw new Error ("'id' de produto inválido! Favor, informar uma string.");
            }

        } else {
            res.status(400);
            throw new Error ("'id' de produto não informado.");
        }

        if (products[0].quantity !== undefined){
            if (typeof products[0].quantity !== "number"){
                res.status(400);
                throw new Error ("Quantidade de produtos inválido! Favor, informar um numero.");
            }

        } else {
            res.status(400);
            throw new Error ("Valor final da compra não informado.");
        }

        if(!filterUser){
            res.status(400);
            throw new Error ("Id de cliente não existe.");
        }
        
        const newPurchase:TPurchase={
            id,
            total_price,
            paid,
            buyer_id,
            productId
        }

        const newPurchasesProducts:TPurchasesProducts={
            purchase_id:id, 
            product_id: products[0].id,
            quantity: products[0].quantity,
        }

        await db("purchases").insert(newPurchase)
        await db("purchases_products").insert(newPurchasesProducts)
	
	    res.status(201).send({message:"Compra realizada com sucesso",purchase:newPurchase});

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
                
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        } 
    }
})

app.get('/purchase',async (req:Request,res:Response)=>{
    try {
        const result = await db("purchases")

        res.status(200).send(result)      
    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
                
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }        
    }
})

app.get('/purchase/:id', async(req:Request, res:Response)=>{
    try {
        const id = req.params.id

        const [purchase]:TPurchase[] = await db.select("purchases.*","clients.name", "clients.email")
        .from("purchases")
        .leftJoin("clients","clients.id","=","purchases.buyer_id")
        .where({"purchases.id":id})
        
        const products = await db.select("products.*", "purchases_products.quantity")
        .from("purchases_products")
        .leftJoin("products","purchases_products.product_id","=","products.id")
        .where({"purchases_products.purchase_id":id})

        const productsInPurchase:TProductsInPurchase[] =[{...purchase, products: products}]

        res.status(200).send(productsInPurchase)

        
    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
                
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        } 
    }
})