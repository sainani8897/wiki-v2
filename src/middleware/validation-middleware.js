const validator = require('../helpers/validate')
const { ValidationException } = require('../exceptions')

exports.signup = (req, res, next) => {
  const validationRule = {
    email: 'required|email',
    org_email: 'required|email',
    org_name: 'required|string',
    first_name: 'required|string',
    last_name: 'required|string',
    password: 'required|string|min:6|confirmed',
    user_type:
      'required|in:institute,individual,instructor,organization,student'
  }
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      console.log(Object.values(err)[0])
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.login = (req, res, next) => {
  const validationRule = {
    email: 'required|email',
    password: 'required'
  }
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.userRules = (req, res, next) => {
  const validationRule = {
    email: 'required|email',
    first_name: 'required|string',
    last_name: 'required|string',
    roles: 'required|array'
  }

  if (req.method === 'PATCH') {
    validationRule._id = ['required', 'regex:/^[0-9a-fA-F]{24}$/']
  } else {
    validationRule.password = 'required|string|min:6|confirmed'
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.changePassword = (req, res, next) => {
  const validationRule = {
    current_password: 'required',
    new_password: 'required|string|min:6|confirmed'
  }
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.mediaManager = (req, res, next) => {
  let validationRule = {
    file: 'required|files',
    name: 'string'
  }

  if (req.method === 'DELETE') {
    validationRule = {
      _id: 'required|array'
    }
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.documentRules = (req, res, next) => {
  let validationRule = {
    'payload.name': 'required',
    'payload.added_at': 'required',
    'payload.files': 'required|array',
    'payload.files.*.name': 'required',
    'payload.files.*.url': 'required|string',
    'payload.files.*._id': 'required'
  }

  if (req.method === 'DELETE') {
    validationRule = {
      _id: 'required|array'
    }
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.roleRules = (req, res, next) => {
  let validationRule = {
    'payload.name': 'required',
    'payload.permissions': 'required|array'
  }

  if (req.method === 'DELETE') {
    validationRule = {
      _id: 'required|array'
    }
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

// Customers

exports.myCustomers = (req, res, next) => {
  const validationRule = {
    'payload.first_name': 'required',
    'payload.last_name': 'required',
    'payload.email': 'required|email',
    'payload.mobile': 'required|numeric',
    // "payload.company_name":"string",
    // "payload.company_email":"email",
    // "payload.address.address_line1":"required|string",
    // "payload.address.address_line2":"required|string",
    // "payload.address.city":"required|string",
    // "payload.address.state":"required|string",
    // "payload.address.pincode":'required|numeric',
    // "payload.address.latitude" :'required|numeric',
    // "payload.address.longitude"  :'required|numeric',
    'payload.status': 'required|string'
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

// Category validation rules

exports.myCategories = (req, res, next) => {
  let validationRule = {
    'payload.category_name': 'required|string',
    'payload.sort': 'required|numeric',
    'payload.status': 'required|string'
  }

  if (req.method === 'DELETE') {
    validationRule = {
      _id: 'required|array'
    }
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

// Tax validation rules

exports.myTaxes = (req, res, next) => {
  const validationRule = {
    'payload.title': 'required|string',
    'payload.type': 'required|in:percentage,amount',
    'payload.value': 'required|numeric',
    'payload.status': 'required|string'
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.myProducts = (req, res, next) => {
  let validationRule = {
    'payload.name': 'required|string',
    'payload.sku': 'required|string',
    'payload.serial_number': 'required|numeric',
    'payload.qty': 'required|numeric',
    'payload.cost': 'required|numeric'
  }

  if (req.method === 'PATCH') {
    validationRule['payload._id'] = ['required', 'regex:/^[0-9a-fA-F]{24}$/']
  }

  if (req.method === 'DELETE') {
    validationRule = {
      _id: 'required|array'
    }
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.vendorRules = (req, res, next) => {
  let validationRule = {
    'payload.first_name': 'required',
    'payload.last_name': 'required',
    'payload.company_name': 'required',
    'payload.display_name': 'required',
    'payload.email': 'required|email',
    'payload.phone_number': 'required'
    /* "payload.address": "required",
    "payload.address.address_line1": "required",
    "payload.address.address_line2": "required",
    "payload.address.city": "required",
    "payload.address.state": "required",
    "payload.address.pin": "required",
    "payload.address.country": "required", */
  }

  if (req.method === 'PATCH') {
    validationRule['payload._id'] = ['required', 'regex:/^[0-9a-fA-F]{24}$/']
  }

  if (req.method === 'DELETE') {
    validationRule = {
      _id: 'required|array'
    }
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.saleOrderRules = (req, res, next) => {
  let validationRule = {
    'payload.order_no': 'required',
    'payload.sale_date': 'required|date',
    'payload.shipment_date': 'required|date',
    'payload.customer_id': 'required',
    'payload.sales_executives': 'required|array',
    'payload.items': 'required|array',
    'payload.items.*.product_id': 'required',
    'payload.items.*.qty': 'required',
    'payload.items.*.rate': 'required',
    'payload.items.*.amount': 'required',
    'payload.sale_details': 'required',
    'payload.sale_details.total': 'required',
    'payload.sale_details.sub_total': 'required'
  }

  if (req.method === 'PATCH') {
    validationRule['payload._id'] = ['required', 'regex:/^[0-9a-fA-F]{24}$/']
  }

  if (req.method === 'DELETE') {
    validationRule = {
      _id: 'required|array'
    }
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.pointOfSale = (req, res, next) => {
  let validationRule = {
    // "payload.order_no": "required",
    // "payload.sale_date": "required|date",
    // "payload.shipment_date": "required|date",
    'payload.customer_id': 'required',
    // "payload.sales_executives": "required|array",
    'payload.items': 'required|array',
    'payload.items.*.product_id': 'required',
    'payload.items.*.qty': 'required',
    'payload.items.*.rate': 'required',
    'payload.items.*.amount': 'required',
    'payload.sale_details': 'required',
    'payload.sale_details.total': 'required',
    'payload.sale_details.sub_total': 'required'
  }

  if (req.method === 'PATCH') {
    validationRule['payload._id'] = ['required', 'regex:/^[0-9a-fA-F]{24}$/']
  }

  if (req.method === 'DELETE') {
    validationRule = {
      _id: 'required|array'
    }
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.purchaseOrderRules = (req, res, next) => {
  let validationRule = {
    'payload.order_no': 'required',
    'payload.sale_date': 'required|date',
    'payload.delivery_date': 'required|date',
    'payload.vendor_id': 'required',
    // "payload.status": "required",
    'payload.items': 'required|array',
    'payload.items.*.product_id': 'required',
    'payload.items.*.qty': 'required',
    'payload.items.*.rate': 'required',
    'payload.items.*.amount': 'required',
    'payload.sale_details': 'required',
    'payload.sale_details.total': 'required',
    'payload.sale_details.sub_total': 'required'
  }

  if (req.method === 'PATCH') {
    validationRule['payload._id'] = ['required', 'regex:/^[0-9a-fA-F]{24}$/']
  }

  if (req.method === 'DELETE') {
    validationRule = {
      _id: 'required|array'
    }
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.packageRules = (req, res, next) => {
  let validationRule = {
    'payload.package_slip': 'required',
    'payload.date': 'required|date',
    // "payload.status": "required",
    'payload.sales_order': 'required',
    'payload.package': 'required|array',
    'payload.package.*.product_id': 'required',
    'payload.package.*.pcs': 'required'
  }

  if (req.method === 'PATCH') {
    validationRule['payload._id'] = ['required', 'regex:/^[0-9a-fA-F]{24}$/']
  }

  if (req.method === 'DELETE') {
    validationRule = {
      _id: 'required|array'
    }
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.shipmentRules = (req, res, next) => {
  let validationRule = {
    'payload.shipping_type': 'required',
    'payload.shipment_date': 'required|date',
    'payload.shipment_no': 'required',
    'payload.status': 'required',
    'payload.sales_order': 'required'
  }

  if (req.method === 'PATCH') {
    validationRule['payload._id'] = ['required', 'regex:/^[0-9a-fA-F]{24}$/']
  }

  if (req.method === 'DELETE') {
    validationRule = {
      _id: 'required|array'
    }
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.invoiceRules = (req, res, next) => {
  let validationRule = {
    'payload.order_no': 'required',
    'payload.invoice_date': 'required|date',
    'payload.shipment_date': 'date',
    'payload.sales_order': 'required',
    'payload.customer_id': 'required',
    'payload.sales_executives': 'required|array',
    'payload.items': 'required|array',
    'payload.items.*.product_id': 'required',
    'payload.items.*.qty': 'required',
    'payload.items.*.rate': 'required',
    'payload.items.*.amount': 'required',
    'payload.sale_details': 'required',
    'payload.sale_details.total': 'required',
    'payload.sale_details.sub_total': 'required'
  }

  if (req.method === 'PATCH') {
    validationRule['payload._id'] = ['required', 'regex:/^[0-9a-fA-F]{24}$/']
  }

  if (req.method === 'DELETE') {
    validationRule = {
      _id: 'required|array'
    }
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.paymentRules = (req, res, next) => {
  let validationRule = {
    'payload.payment_no': 'required',
    'payload.payment_date': 'required|date',
    'payload.amount': 'required',
    'payload.invoice': 'required',
    'payload.payment_mode': 'required|in:Bank Transfer,Check,Cash',
    'payload.deposit_to': 'required',
    'payload.payment_type': 'required|in:full_amount,partial_amount'
  }

  if (req.method === 'PATCH') {
    validationRule['payload._id'] = ['required', 'regex:/^[0-9a-fA-F]{24}$/']
  }

  if (req.method === 'DELETE') {
    validationRule = {
      _id: 'required|array'
    }
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.billRules = (req, res, next) => {
  let validationRule = {
    'payload.bill_no': 'required',
    'payload.due_date': 'required|date',
    'payload.bill_date': 'required|date',
    'payload.vendor_id': 'required',
    'payload.purchase_order': 'required',
    // "payload.status": "required",
    'payload.items': 'required|array',
    'payload.items.*.product_id': 'required',
    'payload.items.*.qty': 'required',
    'payload.items.*.rate': 'required',
    'payload.items.*.amount': 'required',
    'payload.sale_details': 'required',
    'payload.sale_details.total': 'required',
    'payload.sale_details.sub_total': 'required'
  }

  if (req.method === 'PATCH') {
    validationRule['payload._id'] = ['required', 'regex:/^[0-9a-fA-F]{24}$/']
  }

  if (req.method === 'DELETE') {
    validationRule = {
      _id: 'required|array'
    }
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.receivableRules = (req, res, next) => {
  let validationRule = {
    'payload.receivable_no': 'required',
    'payload.date': 'required|date',
    // "payload.status": "required",
    'payload.purchase_order': 'required',
    'payload.receivable': 'required|array',
    'payload.receivable.*.product_id': 'required',
    'payload.receivable.*.ordered_qty': 'required',
    'payload.receivable.*.received_qty': 'required'
  }

  if (req.method === 'PATCH') {
    validationRule['payload._id'] = ['required', 'regex:/^[0-9a-fA-F]{24}$/']
  }

  if (req.method === 'DELETE') {
    validationRule = {
      _id: 'required|array'
    }
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.org = (req, res, next) => {
  const validationRule = {
    org_email: 'required|email',
    org_name: 'required|string',
    first_name: 'required|string',
    last_name: 'required|string'
  }
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      console.log(Object.values(err)[0])
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}

exports.courseRules = (req, res, next) => {
  let validationRule = {
    'payload.title': 'required|string',
    'payload.instructor': 'required|string',
    'payload.categories': 'required|array',
    'payload.status': 'required|string',
    'payload.course_price': 'required|numeric',
    'payload.cut_off_price': 'required|numeric'
  }

  if (req.method === 'PATCH') {
    validationRule['payload._id'] = ['required', 'regex:/^[0-9a-fA-F]{24}$/']
  }

  if (req.method === 'DELETE') {
    validationRule = {
      _id: 'required|array'
    }
  }

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      console.log(Object.values(err)[0])
      throw new ValidationException(
        Object.values(err.all())[0][0] ?? 'Validation Failed Bad Request!',
        err
      )
    } else {
      next()
    }
  })
}
