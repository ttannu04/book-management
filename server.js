const express = require("express")
const mysql = require("mysql2")
const multer = require("multer")
const session = require("express-session")
const path = require("path")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: "bookshop-secret",
    resave: false,
    saveUninitialized: true
}))

app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))

/* =========================
   MYSQL CONNECTION
========================= */

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "02351245",
    database: "bookshop"
})

db.connect(err => {
    if (err) {
        console.log("❌ MySQL Error:", err)
        return
    }
    console.log("✅ MySQL Connected")
})

/* =========================
   IMAGE UPLOAD
========================= */

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }

})

const upload = multer({ storage })

/* =========================
   LOGIN
========================= */

app.post("/login", (req, res) => {

    const { username, password } = req.body

    if (username === "admin" && password === "admin") {

        req.session.admin = true

        return res.json({
            success: true,
            role: "admin"
        })
    }

    res.json({
        success: true,
        role: "customer"
    })

})

/* =========================
   CHECK ADMIN
========================= */

app.get("/check-admin", (req, res) => {

    if (req.session.admin) {
        return res.json({ admin: true })
    }

    res.json({ admin: false })

})

/* =========================
   LOGOUT
========================= */

app.get("/logout", (req, res) => {

    req.session.destroy(() => {
        res.sendStatus(200)
    })

})

/* =========================
   ADD BOOK (ADMIN)
========================= */

app.post("/add-book", upload.single("image"), (req, res) => {

    if (!req.session.admin) {
        return res.status(403).json({ error: "Unauthorized" })
    }

    const { title, author, category, price } = req.body

    const image = req.file ? req.file.filename : null

    db.query(
        "INSERT INTO books(title,author,category,price,image) VALUES (?,?,?,?,?)",
        [title, author, category, price, image],
        (err) => {

            if (err) {
                console.log(err)
                return res.status(500).json({ error: "Database error" })
            }

            res.json({ message: "Book added successfully" })

        }
    )

})

/* =========================
   GET BOOKS
========================= */

app.get("/books", (req, res) => {

    db.query(
        "SELECT * FROM books ORDER BY id DESC",
        (err, result) => {

            if (err) return res.status(500).json(err)

            res.json(result)

        }
    )

})

/* =========================
   DELETE BOOK
========================= */

app.delete("/delete-book/:id", (req, res) => {

    if (!req.session.admin) {
        return res.status(403).json({ error: "Unauthorized" })
    }

    db.query(
        "DELETE FROM books WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) return res.status(500).json(err)

            res.json({ message: "Book deleted" })

        }
    )

})

/* =========================
   BUY BOOK
========================= */

app.post("/buy/:id", (req, res) => {

    db.query(
        "SELECT * FROM books WHERE id=?",
        [req.params.id],
        (err, rows) => {

            if (err) return res.status(500).json(err)

            if (rows.length === 0) {
                return res.status(404).json({ error: "Book not found" })
            }

            const book = rows[0]

            db.query(
                "INSERT INTO sales(title,price,date) VALUES (?,?,NOW())",
                [book.title, book.price],
                (err2) => {

                    if (err2) return res.status(500).json(err2)

                    res.json({ message: "Order placed successfully" })

                }
            )

        }
    )

})

/* =========================
   SALES LIST
========================= */

app.get("/sales", (req, res) => {

    db.query(
        "SELECT * FROM sales ORDER BY id DESC",
        (err, result) => {

            if (err) return res.status(500).json(err)

            res.json(result)

        }
    )

})

/* =========================
   CUSTOMER BOOK REQUEST
========================= */

app.post("/request-book", (req, res) => {

    const { title, author } = req.body

    db.query(
        "INSERT INTO requests(title,author) VALUES (?,?)",
        [title, author],
        (err) => {

            if (err) return res.status(500).json(err)

            res.json({ message: "Request sent" })

        }
    )

})

/* =========================
   GET REQUESTS
========================= */

app.get("/requests", (req, res) => {

    db.query(
        "SELECT * FROM requests ORDER BY id DESC",
        (err, result) => {

            if (err) return res.status(500).json(err)

            res.json(result)

        }
    )

})

/* =========================
   DASHBOARD DATA
========================= */

app.get("/dashboard", (req, res) => {

    db.query(
        "SELECT COUNT(*) AS sales FROM sales",
        (err, sales) => {

            db.query(
                "SELECT SUM(price) AS revenue FROM sales",
                (err2, revenue) => {

                    db.query(
                        "SELECT COUNT(*) AS monthSales FROM sales WHERE MONTH(date)=MONTH(CURRENT_DATE())",
                        (err3, month) => {

                            res.json({
                                sales: sales[0].sales,
                                monthSales: month[0].monthSales,
                                revenue: revenue[0].revenue || 0
                            })

                        }
                    )

                }
            )

        }
    )

})

/* =========================
   START SERVER
========================= */

app.listen(3000, () => {

    console.log("🚀 Server running at http://localhost:3000")

})