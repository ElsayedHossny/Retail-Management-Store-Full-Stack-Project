import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
const portRun = 3000;

let connection;
try {
  connection = await mysql.createConnection({
    host: "localhost",
    database: "Retail_Store",
    user: "root",
    password: "1234",
  });
  console.log("DataBase Connection");
} catch (error) {
  console.log(error);
}

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
// Frontend uses VITE_API_BASE_URL=http://localhost:3000/api; strip the prefix so
// existing routes (/products, /suppliers, …) still match.
app.use((req, _res, next) => {
  if (req.url === "/api" || req.url.startsWith("/api/")) {
    req.url = req.url.slice(4) || "/";
  }
  next();
});

//================================================== SignUp ========================================
app.post("/auth/signUp", async (req, res) => {
  const { name, email, password, age, gender } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    age === undefined ||
    age === "" ||
    !gender
  ) {
    return res.status(400).json({
      message: "name, email, password, age, and gender are required",
      status: false,
    });
  }

  try {
    const insertQuery = `insert into Users (name, email, password, age, gender) values (?,?,?,?,?)`;
    await connection.execute(insertQuery, [name, email, password, age, gender]);

    console.log("Sucess Add New User");
    res.status(201).json({
      message: "Sucess Add New User",
      status: true,
      User: { name, email },
    });
  } catch (error) {
    console.log("Error :: ", error);
    res
      .status(500)
      .json({ message: "Not add User", status: false, Error: error.message });
  }
});

//================================================== SignIn ========================================

app.post("/auth/signIn", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "email and password are required",
      status: false,
    });
  }

  try {
    const selectQuery = `select name, email from Users where email=? && password=?`;
    const [result] = await connection.execute(selectQuery, [email, password]);
    if (!result.length)
      return res
        .status(401)
        .json({ message: "User not define", status: false });

    console.log("result :::: ", result);
    res
      .status(200)
      .json({ message: "Sucess Login", status: true, User: result[0] });
  } catch (error) {
    console.log("Error :: ", error.message);
    res.status(500).json({ message: "Error in Execute ", status: false });
  }
});

//========================================================== Suppliers ==============================================

app.get("/suppliers", async (req, res, next) => {
  try {
    const retriveQuery = `select * from Suppliers;`;
    const [result] = await connection.execute(retriveQuery);
    res.status(201).json({
      message: "Suppliers retrieved successfully",
      count: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/supplier/add", async (req, res, next) => {
  try {
    const { supplierName, contactNumber } = req.body;
    if (!supplierName || !contactNumber) {
      return res.status(400).json({
        message: "supplierName and contactNumber are required",
      });
    }
    const insertQuery = `INSERT INTO Suppliers (supplierName, contactNumber) VALUES (?, ?)`;
    const [result] = await connection.execute(insertQuery, [
      supplierName,
      contactNumber,
    ]);
    res.status(201).json({
      message: "Supplier added successfully",
      supplierId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/supplier/delete/:id", async (req, res, next) => {
  try {
    const { id } = await req.params;

    const [existing] = await connection.execute(
      "SELECT * FROM Suppliers WHERE supplierId = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: `Supplier with ID ${id} not found`,
      });
    }
    const deleteQuery = `DELETE FROM Suppliers where supplierId = ?`;
    const [result] = await connection.execute(deleteQuery, [id]);

    res.status(201).json({
      message: "Supplier is deleted",
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/supplier/update/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { supplierName, contactNumber } = req.body;

    // check if Id is Exist
    const [existing] = await connection.execute(
      "SELECT * FROM Suppliers WHERE supplierId = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: `Supplier with ID ${id} not found`,
      });
    }
    let updates = [];
    let values = [];

    if (supplierName !== undefined) {
      updates.push("supplierName = ?");
      values.push(supplierName);
    }
    if (contactNumber !== undefined) {
      updates.push("contactNumber = ?");
      values.push(contactNumber);
    }
    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }
    values.push(id);

    const query = `UPDATE Suppliers SET ${updates.join(", ")} WHERE supplierId = ?`;
    await connection.execute(query, values);

    res.status(200).json({
      message: "Supplier updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

app.get("/suppliers/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    // check if Id is Exist
    const [existing] = await connection.execute(
      "SELECT * FROM Suppliers WHERE supplierId = ?",
      [id],
    );

    const retriveQuery = `SELECT * FROM Suppliers WHERE supplierId = ?`;
    const [result] = await connection.execute(retriveQuery, [id]);
    res.status(201).json({
      message: "Supplier retrieved successfully",
      supplier: result,
    });
  } catch {
    next(error);
  }
});

//========================================================== Products ==============================================

app.get("/products", async (req, res, next) => {
  try {
    const retriveQuery = `select * from Products;`;
    const [result] = await connection.execute(retriveQuery);
    res.status(201).json({
      message: "Products retrieved successfully",
      count: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
// can't add without supplierId
app.post("/product/add", async (req, res, next) => {
  try {
    const { productName, price, stockQuantity, supId } = req.body;

    if (!productName || !price || !stockQuantity || !supId) {
      return res.status(400).json({
        message: "supplierName and contactNumber are required",
      });
    }

    const [existing] = await connection.execute(
      "SELECT * FROM Suppliers WHERE supplierId = ?",
      [supId],
    );
    if (existing.length === 0) {
      return res.status(404).json({
        message: `Supplier with ID ${supId} not found`,
      });
    }
    const insertQuery = `insert into Products (productName, price, stockQuantity, supId) VALUES (?,?,?,?);`;
    const [result] = await connection.execute(insertQuery, [
      productName,
      price,
      stockQuantity,
      supId,
    ]);
    res.status(201).json({
      message: "Product added successfully",
      ProductId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/product/delete/:id", async (req, res, next) => {
  try {
    const { id } = await req.params;

    const [existing] = await connection.execute(
      "SELECT * FROM Products WHERE productId = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: `product with ID ${id} not found`,
      });
    }

    const deleteQuery = `DELETE FROM Products where productId = ?`;
    const [result] = await connection.execute(deleteQuery, [id]);

    res.status(201).json({
      message: "Product is deleted",
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/product/update/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { productName, price, stockQuantity, supId } = req.body;

    const fields = [
      { col: "productName", val: productName },
      { col: "price", val: price },
      { col: "stockQuantity", val: stockQuantity },
      { col: "supId", val: supId },
    ];

    // check if Id is Exist
    const [existing] = await connection.execute(
      "SELECT * FROM Products WHERE productId = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: `product with ID ${id} not found`,
      });
    }

    const updates = [];
    const values = [];

    fields.forEach(({ col, val }) => {
      if (val !== undefined) {
        updates.push(`${col} = ?`);
        values.push(val);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }
    values.push(id);

    const query = `UPDATE Products SET ${updates.join(", ")} WHERE productId = ?`;
    await connection.execute(query, values);

    res.status(200).json({
      message: "Product updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

app.get("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    // check if Id is Exist
    const [existing] = await connection.execute(
      "SELECT * FROM Products WHERE productId = ?",
      [id],
    );
    if (existing.length === 0) {
      return res.status(404).json({
        message: `product with ID ${id} not found`,
      });
    }

    const retriveQuery = `SELECT * FROM Products WHERE productId = ?`;
    const [result] = await connection.execute(retriveQuery, [id]);
    res.status(201).json({
      message: "Product retrieved successfully",
      Product: result,
    });
  } catch {
    next(error);
  }
});

//========================================================== Sales ==============================================

app.get("/sales", async (req, res, next) => {
  try {
    const retriveQuery = `select * from Sales;`;
    const [result] = await connection.execute(retriveQuery);
    res.status(201).json({
      message: "Sales retrieved successfully",
      count: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
// can't add without productId
app.post("/sales/add", async (req, res, next) => {
  try {
    const { quantitySold, saleDate, proId } = req.body;

    if (!quantitySold || !saleDate || !proId) {
      return res.status(400).json({
        message: "quantitySold and saleDate and proId are required",
      });
    }

    console.log(quantitySold, saleDate, proId);

    const [existing] = await connection.execute(
      "SELECT * FROM Products WHERE productId = ?",
      [proId],
    );
    if (existing.length === 0) {
      return res.status(401).json({
        message: `Product with ID ${proId} not found`,
      });
    }

    const insertQuery = `insert into Sales (quantitySold, saleDate, proId) VALUES (?,?,?)`;
    const [result] = await connection.execute(insertQuery, [
      quantitySold,
      saleDate,
      proId,
    ]);

    res.status(201).json({
      message: "sales added successfully",
      SalesId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/sales/product/:productId", async (req, res, next) => {
  try {
    const { productId } = await req.params;

    console.log(productId);

    const [existing] = await connection.execute(
      "SELECT * FROM Products WHERE productId = ?",
      [productId],
    );
    if (existing.length === 0) {
      return res.status(404).json({
        message: `No sales found for product with ID ${productId}`,
      });
    }

    const insertQuery = `SELECT productId,salesId,productName,price,stockQuantity,quantitySold,saleDate FROM Products INNER JOIN Sales ON Products.productId = Sales.proId WHERE Products.productId = ?`;
    const [result] = await connection.execute(insertQuery, [productId]);

    res.status(200).json({
      message: "Sales retrieved successfully for this product",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

//========================================================== Joined Api ==============================================

app.get("/sales/report/totalQuantity", async (req, res, next) => {
  try {
    const retriveQuery = `SELECT productId, productName, SUM(quantitySold) AS totalQuantitySold FROM Products 
    INNER JOIN Sales ON Products.productId = Sales.proId
    GROUP BY Products.productId, Products.productName;`;

    const [result] = await connection.execute(retriveQuery);
    res.status(201).json({
      message: "total quantity sold for each product",
      count: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/product/highest/stockQuantity", async (req, res, next) => {
  try {
    const retriveQuery = `SELECT productId, productName, stockQuantity FROM Products
                            WHERE stockQuantity = (SELECT MAX(stockQuantity) FROM Products);`;

    const [result] = await connection.execute(retriveQuery);
    res.status(201).json({
      message: "product with the highest stock quantity.",
      count: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/suppliers/namesfilter/:char", async (req, res, next) => {
  try {
    const { char } = req.params;

    const retriveQuery = `SELECT * FROM Suppliers WHERE supplierName LIKE ?`;
    const [result] = await connection.execute(retriveQuery, [`${char}%`]);

    if (result.length === 0) {
      return res.status(404).json({
        message: `No suppliers found starting with the letter '${char}'`,
        count: 0,
      });
    }

    res.status(200).json({
      message: `Suppliers starting with '${char}' retrieved successfully`,
      count: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/products/reports/never-sold", async (req, res, next) => {
  try {
    const query = `
      SELECT 
        p.productId, 
        p.productName, 
        p.price, 
        p.stockQuantity
      FROM Products p
      LEFT JOIN Sales s ON p.productId = s.proId
      WHERE s.proId IS NULL
    `;

    const [unsoldProducts] = await connection.execute(query);

    if (unsoldProducts.length === 0) {
      return res.status(404).json({
        message:
          "No unsold products found. All products have been sold at least once.",
        count: 0,
      });
    }

    res.status(200).json({
      message: "Products that have never been sold retrieved successfully",
      count: unsoldProducts.length,
      data: unsoldProducts,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/Sales/Products", async (req, res, next) => {
  try {
    const retriveQuery = `select productName,quantitySold,saleDate from Sales inner join  Products  on Sales.proId = Products.productId;`;

    const [result] = await connection.execute(retriveQuery);
    res.status(201).json({
      message: "All Sales-Products retrieved successfully",
      count: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

//==================================================================================================================
app.use((err, req, res, next) => {
  res.status(500).json({
    status: "Error",
    message: err.message || "Internal Server Error",
  });
});

app.listen(portRun, () => {
  console.log(`Server Running`);
});
