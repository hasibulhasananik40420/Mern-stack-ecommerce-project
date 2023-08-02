const Product = require("../models/productModel");
const slugify = require("slugify");
const { successResponse } = require("./responseController");
const createError = require("http-errors");
const {
  createProduct,
  getAllProduct,
  getProduct,
  deleteSingleProduct,

} = require("../services/productService");

//handleCreateProduct
const handleCreateProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, shipping, category } = req.body;

    const image = req.file;

    if (!image) {
      throw createError(400, "image file is required");
    }

    //  console.log(image)

    if (image.size > 1024 * 1024 * 2) {
      throw createError(400, "File to large.It must be less then 2 MB");
    }

    const imageBufferString = image.buffer.toString("base64");

    const productData = {
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      imageBufferString,
    };

    //create product
    const product = await createProduct(productData);

    return successResponse(res, {
      statusCode: 200,
      message: "Product was create successfully",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

//handleGetProducts
const handleGetProducts = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      $or: [
        { name: { $regex: searchRegExp } },
        
      ],
    };

    const productsData = await getAllProduct(page, limit,filter);

    return successResponse(res, {
      statusCode: 200,
      message: "Products was return successfully",
      payload: {
        products: productsData.products,
        pagination: {
          totalPages: productsData.totalPages,
          currentPage: page,
          previousPage: page - 1,
          nextPage: page + 1,

          totalNumberOfProducts: productsData.count,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

//handleGet single Product
const handleGetProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await getProduct(slug);
    return successResponse(res, {
      statusCode: 200,
      message: "Product was return successfully",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

//handledelete single Product
const handleDeleteProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const deleteProduct = await deleteSingleProduct(slug);
    return successResponse(res, {
      statusCode: 200,
      message: "Product delete successfully",
      payload: deleteProduct,
    });
  } catch (error) {
    next(error);
  }
};




const handleUpdateProduct = async (req, res, next) => {
  try {
    const {slug} = req.params

    const updateOptions = { new: true, runValidators: true, context: "query" };
    
    let updates = {};
    const allowedFields = ["name", "description", "price", "sold", "quantity","shipping"];

    for (let key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    }

    if(updates.name){
      updates.slug = slugify(updates.name)
    }

    const image = req.file;
    if (image) {
      //image size maximum 2 mb
      if (image.size > 1024 * 1024 * 2) {
        throw createError(400, "File to large.It must be less then 2 MB");
      }

      updates.image = image.buffer.toString("base64");
    }

    // delete updates.email

    const updateProduct = await Product.findOneAndUpdate(
      {slug},
      updates,
      updateOptions
    )

    if (!updateProduct) {
      throw new Error("Product with this slug does not exist");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Product update successfully",
      payload: updateProduct,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
  handleDeleteProduct,
  handleUpdateProduct,
};
