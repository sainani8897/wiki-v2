const User = require('../Models/User')
const bcrypt = require('bcrypt')
const { connectDb } = require('../../config/database')
const { Permission, Role, Organization } = require('../Models')

const seedUser = {
  name: 'Admin',
  email: 'admin@gmail.com',
  first_name: 'Super',
  last_name: 'Owner',
  phone_number: '9000152046',
  password: bcrypt.hashSync('Admin@123', 10)
}

const permissionSeed = [
  {
    name: 'create_docs',
    display_text: 'Create Docs',
    group_name: 'Docs'
  },
  {
    name: 'read_docs',
    display_text: 'Read Docs',
    group_name: 'Docs'
  },
  {
    name: 'update_docs',
    display_text: 'Update Docs',
    group_name: 'Docs'
  },
  {
    name: 'delete_docs',
    display_text: 'Delete Docs',
    group_name: 'Docs'
  },
  {
    name: 'read_media',
    display_text: 'Read Media',
    group_name: 'Media Management'
  },
  {
    name: 'create_media',
    display_text: 'Create Media',
    group_name: 'Media Management'
  },
  {
    name: 'update_media',
    display_text: 'Update Media',
    group_name: 'Media Management'
  },
  {
    name: 'delete_media',
    display_text: 'Delete Media',
    group_name: 'Media Management'
  }
]

const userManagement = [
  {
    name: 'read_users',
    display_text: 'Read User',
    group_name: 'User Management'
  },
  {
    name: 'create_users',
    display_text: 'Create User',
    group_name: 'User Management'
  },
  {
    name: 'update_users',
    display_text: 'Update User',
    group_name: 'User Management'
  },
  {
    name: 'delete_users',
    display_text: 'Delete User',
    group_name: 'User Management'
  }
]

const productsManagement = [
  {
    name: 'read_products',
    display_text: 'Read Product',
    group_name: 'Product Management'
  },
  {
    name: 'create_products',
    display_text: 'Create Product',
    group_name: 'Product Management'
  },
  {
    name: 'update_products',
    display_text: 'Update Product',
    group_name: 'Product Management'
  },
  {
    name: 'delete_products',
    display_text: 'Delete Product',
    group_name: 'Product Management'
  }
]

const categoryManagement = [
  {
    name: 'read_category',
    display_text: 'Read Product',
    group_name: 'Product Management'
  },
  {
    name: 'create_category',
    display_text: 'Create Category',
    group_name: 'Category Management'
  },
  {
    name: 'update_category',
    display_text: 'Update Category',
    group_name: 'Category Management'
  },
  {
    name: 'delete_category',
    display_text: 'Delete Category',
    group_name: 'Category Management'
  }
]

const customersManagement = [
  {
    name: 'read_customers',
    display_text: 'Read Customer',
    group_name: 'Customer Management'
  },
  {
    name: 'create_customers',
    display_text: 'Create Customer',
    group_name: 'Customer Management'
  },
  {
    name: 'update_customers',
    display_text: 'Update Customer',
    group_name: 'Customer Management'
  },
  {
    name: 'delete_customers',
    display_text: 'Delete Customer',
    group_name: 'Customer Management'
  }
]

const vendorsManagement = [
  {
    name: 'read_vendors',
    display_text: 'Read Vendor',
    group_name: 'Vendor Management'
  },
  {
    name: 'create_vendors',
    display_text: 'Create Vendor',
    group_name: 'Vendor Management'
  },
  {
    name: 'update_vendors',
    display_text: 'Update Vendor',
    group_name: 'Vendor Management'
  },
  {
    name: 'delete_vendors',
    display_text: 'Delete Vendor',
    group_name: 'Vendor Management'
  }
]

const salesOrderManagement = [
  {
    name: 'read_sales_orders',
    display_text: 'Read Sales Order',
    group_name: 'Sales Order Management'
  },
  {
    name: 'create_sales_orders',
    display_text: 'Create Sales Order',
    group_name: 'Sales Order Management'
  },
  {
    name: 'update_sales_orders',
    display_text: 'Update Sales Order',
    group_name: 'Sales Order Management'
  },
  {
    name: 'delete_sales_orders',
    display_text: 'Delete Sales Order',
    group_name: 'Sales Order Management'
  }
]

const allPermissions = [...permissionSeed, ...salesOrderManagement, ...vendorsManagement, ...customersManagement, ...categoryManagement, ...productsManagement, ...userManagement]

const permissionSeeder = async () => {
  await Permission.deleteMany({})
  await Permission.insertMany(allPermissions)

  const superAdmin = await Role.findOneAndUpdate(
    { name: 'super_admin' },
    { name: 'super_admin', display_text: 'Adminstrator' },
    { upsert: true }
  )

  const permissions = await Permission.find({})

  if (permissions) {
    superAdmin.permissions = permissions

    /* Save the Super admin permissions */
    superAdmin.save()

    const org = await Organization.findOneAndUpdate(
      { name: 'Decode Labs' },
      { name: 'Decode Labs', org_email: 'admin@decodelabs.in' },
      { upsert: true }
    )

    const user = await User.findOneAndUpdate(
      { email: seedUser.email },
      seedUser,
      { upsert: true }
    )
    user.roles = [superAdmin._id]
    user.org_id = org._id
    await user.save()
  }

  return true
}

const seedDB = async () => {
  await connectDb()
  const role = await permissionSeeder()
}

seedDB().then(() => {
  console.log('Database seed completed')
  process.exit()
})
