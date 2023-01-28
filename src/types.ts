export type TClient = {
    id: string
    email: string
    name: string
    password: string
}

export enum CATEGORY_PROD {
    ACESSORIES = "Acessórios",
    CLOTHES_AND_SHOES = "Roupas e Calçados",
    ELETRONICS = "Eletrônicos",
}

export type TProduct = {
    id: string
    name: string
    price: number
    description: string
    image_url: string
}

export type TPurchase = {
    id:string
    buyer_id: string
    total_price: number
    paid:number
}

export type TProductsInPurchase = {
    id:string
    buyer_id: string
    total_price: number
    paid:number
    products:TProduct[]
}

export type TPurchasesProducts = {
    purchase_id: string, 
    product_id: string,
    quantity:number,
}