const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const morgan = require('morgan')
const pool = require("./db")
const { body, validationResult, check } = require('express-validator');
const res = require('express/lib/response')
const { password } = require('pg/lib/defaults')
const port = 3000

// Set Templating Engines
app.use(expressLayouts)

// set morgan
app.use(morgan('dev'))

// set express json
app.use(express.json());

// Static Middleware 
 app.use(express.static('public'));
 app.use(express.urlencoded({extended :true}))

//information using ejs
app.set('view engine', 'ejs')

// Login page
app.get('/login', (req, res) => {
    const page = "login";
    res.render("login.ejs", {page});  
})  

// Dashboard page
app.get('/', (req, res) => {
    const nama = 'nida';
    const page = "Dashboard";
    res.render("index.ejs", {nama, page});  
})  

// Admin page
app.get('/admin', async (req, res) => {
    const page = 'Admin'
    try{
        const {rows: detcont} = await pool.query(`SELECT id_admin, nama_admin FROM admin`)
        detcont.map(admin => {
            if(admin){
                res.render("admin.ejs", {page, admin}); 
            }
            return true;
        })
    } catch(err){
        throw new Error ('nama salah'); 
    }
})  

// add admin page
app.get('/add_admin', (req, res) => {
    const page = 'Add Admin'
    res.render("add_admin.ejs", {page});  
})

// POST data -> add admin
app.post('/admin',
        body('name').custom(async(name, {req})=>{
            try{
                const {rows: detcont} = await pool.query(`SELECT nama_admin FROM admin where name= '${name}'`)
                detcont.map(contact => {
                    if(contact){
                        throw new Error ('Duplicate name'); 
                    }
                    return true;
                })
            } catch (err){
                throw new Error ('Duplicate name'); 
            }
        }),
        check('email', 'Email not Valid').isEmail().normalizeEmail(), 
        check('mobile', 'Mobile not Valid').isMobilePhone('id-ID'),
        (req, res) => {         
            
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const notif = errors.array();
                res.render("add_admin", {notif})
            } else{
                console.log('1')
                    //insert database
                    const name = req.body.name
                    const email = req.body.email
                    const mobile = req.body.mobile
                    const password_admin = req.body.password_admin
                    const newCont = pool.query(`INSERT INTO admin VALUES ('${name}', '${email}', '${mobile}', '${password_admin}')`, function (err, result){
                        if (err) {
                            console.log("Error Saving : %s ", err);
                        }
                        
                    })
                    res.redirect('/admin')
                    //res.send("now data is added")
            }
})

// detail admin page
app.get('/detail_admin/:id_admin', async (req, res) => {
    const page = 'Detail Admin'
    try{
        const {rows: detcont} = await pool.query(`SELECT * FROM admin WHERE id_admin = '${req.params.id_admin}'`)
        detcont.map(admin => {
            if(admin){
                res.render("detail_admin", {page, admin}); 
            }
            return true;b 
        })
    } catch(err){
        throw new Error ('nama salah'); 
    }
})

// delete admin 
app.get('/detail_admin/del/:id_admin', async (req, res) => {
    try{
        const {rows: detcont} = await pool.query(`DELETE FROM contacs WHERE name = ('${req.params.id_admin}'`)
        detcont.map(admin => {
            if(admin){
                res.redirect('/admin')
            }
            return true;
        })
    } catch(err){
        throw new Error ('data tidak terhapus'); 
    }
})

//customer page
app.get('/customer', (req, res) => {
    const page = "Customer";
    const newCont = pool.query(`SELECT id_customer, nama_customer FROM customer`, function (err, result){
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.render("customer.ejs", {page, data : result.rows}); 
    })
})  

// add customer page
app.get('/add_customer', (req, res) => {
    const page = 'Add Customers'
    res.render("add_customer.ejs", {page});  
})

// POST data -> add contact
app.post('/customer',
        body('name').custom(async(name, {req})=>{
            try{
                const {rows: detcont} = await pool.query(`SELECT nama_customer FROM customer where name= '${name}'`)
                detcont.map(contact => {
                    if(contact){
                        throw new Error ('Duplicate name'); 
                    }
                    return true;
                })
            } catch (err){
                throw new Error ('Duplicate name'); 
            }
        }),
        check('email', 'Email not Valid').isEmail().normalizeEmail(), 
        check('mobile', 'Mobile not Valid').isMobilePhone('id-ID'),
        (req, res) => {         
            
            const errors = validationResult(req);
            if (errors)
            if (!errors.isEmpty()) {
                const notif = errors.array();
                res.render("add_customer", {notif})
            } else{
                    //insert database
                    const name = req.body.name
                    const email = req.body.email
                    const mobile = req.body.mobile
                    const newCont = pool.query(`INSERT INTO customer VALUES ('${name}', '${email}', '${mobile}')`, function (err, result){
                        if (err) {
                            console.log("Error Saving : %s ", err);
                        }
                        
                    })
                    res.redirect('/customer')
                    //res.send("now data is added")
            }    
})

app.get('/detail_customer', (req, res) => {
    const newCont = pool.query(`SELECT * FROM customer WHERE name = ('${req.params.name}')`, function (err, result){
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.render("detail_customer")
    })

})
app.get('/detail_customer/update', (req, res) => {
    const newCont = pool.query(`SELECT * FROM customer WHERE name = ('${req.params.name}')`, function (err, result){
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.render("update_customer", {data : result.rows})
    })
})

app.get('/product', (req, res) => {
    const page = "product";
    res.render("product.ejs", {page});  
}) 

app.get('/add_product', (req, res) => {
    const page = 'Add Product'
    res.render("add_product.ejs", {page});  
})

// POST data -> add contact
app.post('/product',
        body('name').custom(async(name, {req})=>{
            try{
                const {rows: detcont} = await pool.query(`SELECT nama_customer FROM customer where name= '${name}'`)
                detcont.map(contact => {
                    if(contact){
                        throw new Error ('Duplicate name'); 
                    }
                    return true;
                })
            } catch (err){
                throw new Error ('Duplicate name'); 
            }
        }),
        (req, res) => {         
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const notif = errors.array();
                res.render("add_product", {notif})
            } else{
                    //insert database
                    const name = req.body.name
                    const email = req.body.email
                    const mobile = req.body.mobile
                    const newCont = pool.query(`INSERT INTO customer VALUES ('${name}', '${email}', '${mobile}')`, function (err, result){
                        if (err) {
                            console.log("Error Saving : %s ", err);
                        }
                        
                    })
                    res.redirect('/product')
                    //res.send("now data is added")
            }    
})

app.get('/detail_product', (req, res) => {
    // const newCont = pool.query(`SELECT * FROM contacs WHERE name = ('${req.params.name}')`, function (err, result){
    //     if (err) {
    //         console.log(err);
    //         res.status(400).send(err);
    //     }
        res.render("detail_product")
    //})

})
app.get('/selling', (req, res) => {
    const page = "selling";
    res.render("selling.ejs", {page});  
}) 
// // about page
// app.get('/about', (req, res) => {
//     const page = 'About page'
//     res.render("about.ejs", {page}); 
// })

// // contact page
// app.get('/contact', (req, res) => {
//     const page = 'Contact List'
//     const newCont = pool.query(`SELECT name, email FROM contacs`, function (err, result){
//         if (err) {
//             console.log(err);
//             res.status(400).send(err);
//         }
//         res.render("contact.ejs", {page, data : result.rows}); 
//     })
// })

// // add contact page
// app.get('/add', (req, res) => {
//     const page = 'Add Users'
//     res.render("add_contact", {page});  
// })

// // POST data -> add contact
// app.post('/contact',
//         body('name').custom(async(name, {req})=>{
//             try{
//                 const {rows: detcont} = await pool.query(`SELECT name FROM contacs where name= '${name}'`)
//                 detcont.map(contact => {
//                     if(contact){
//                         throw new Error ('Duplicate name'); 
//                     }
//                     return true;
//                 })
//             } catch (err){
//                 throw new Error ('Duplicate name'); 
//             }
//         }),
//         check('email', 'Email not Valid').isEmail().normalizeEmail(), 
//         check('mobile', 'Mobile not Valid').isMobilePhone('id-ID'),
//         (req, res) => {         
            
//             const errors = validationResult(req);
//             if (errors)
//             if (!errors.isEmpty()) {
//                 const notif = errors.array();
//                 res.render("add_contact", {notif})
//             } else{
//                     //insert database
//                     const name = req.body.name
//                     const email = req.body.email
//                     const mobile = req.body.mobile
//                     const newCont = pool.query(`INSERT INTO contacs VALUES ('${name}', '${email}', '${mobile}')`, function (err, result){
//                         if (err) {
//                             console.log("Error Saving : %s ", err);
//                         }
                        
//                     })
//                     res.redirect('/contact')
//                     //res.send("now data is added")
//             }

    
// })

// // detail page
// app.get('/detail/:name', (req, res) => {
//     const newCont = pool.query(`SELECT * FROM contacs WHERE name = ('${req.params.name}')`, function (err, result){
//         if (err) {
//             console.log(err);
//             res.status(400).send(err);
//         }
//         res.render("detail", {data : result.rows})
//     })

// })

// //menghapus data di page detail
// app.get('/detail/del/:name', (req, res) => {
//     const newCont = pool.query(`DELETE FROM contacs WHERE name = ('${req.params.name}')`, function (err, result){
//         if (err) {
//             console.log(err);
//             res.status(400).send(err);
//         }
//             res.redirect('/contact')
//     })

// })

// // update data di page detail
// app.get('/detail/update/:name', (req, res) => {
//     const newCont = pool.query(`SELECT * FROM contacs WHERE name = ('${req.params.name}')`, function (err, result){
//         if (err) {
//             console.log(err);
//             res.status(400).send(err);
//         }
//         res.render("update", {data : result.rows})
//     })

// })

// //POST data update -> update contacts
// app.post('/detail/update/:name',
//         body('name').custom(async(name, {req})=>{
//             try{
//                 //cek duplicate
//                 const {rows: detcont} = await pool.query(`SELECT name FROM contacs where name= '${name}'`)
//                     detcont.map(contact => {
//                         if(name !== contact && req.body.oldname){
//                             throw new Error ('Duplicate name'); 
//                         }
//                         return true;
//                     })
//             } catch (err){
//                 throw new Error ('Duplicate name'); 
//             }
//         }), 
//         check('email', 'Email not Valid').isEmail(), 
//         check('mobile', 'Mobile not Valid').isMobilePhone('id-ID'),
//         (req, res) => {         
//             const errors = validationResult(req);
//             const data = [req.body];
//             if (!errors.isEmpty()) {
//                 const notif = errors.array();
//                 res.render("update", {notif, data})
//             } else{
//                 const {name, email, mobile} = req.body
//                 const newCont = pool.query(`UPDATE contacs SET name = '${name}', email= '${email}', mobile = '${mobile}' WHERE name = '${req.params.name}'`, function (err, result){
//                     if (err) {
//                         console.log("Error Updating : %s ", err);
//                     }
//                     res.redirect('/contact')
//                 })
//             }
// })

// handling error
app.use(function(req, res, next) {

    var err = new Error('Not Found');
    err.status = 404;
    next(err);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})