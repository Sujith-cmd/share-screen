
import User from "../Model/Usermodel.js"
import Vendor from "../Model/Vendormodel.js"
import bcrypt from "bcryptjs"
import { errorHandler } from "../utils/error.js"
import jwt from'jsonwebtoken'
import stripe from 'stripe';
const stripeInstance = stripe('sk_test_51OFALpSB9eYCrjcG6KBzHYP0HYRw1pC5QH1u53yIAUkm6TkjstVL31Z7b1hkz86fc9yioq6DlKWJIH9ZJ8BtJiH800RnMnA1wJ');

export const vendorSignup = async (req,res,next)=>{
    const {username,email,password,isTheatre} =req.body
   
    try {
        const salt= bcrypt.genSaltSync(10);
        const hash=bcrypt.hashSync(password, salt)
        console.log(hash);
    const newVendor= new Vendor({
        username,email,password:hash,isTheatre
    })
        const savedVendor=await newVendor.save()
        
        if(!savedVendor||savedVendor==undefined){
           console.log("Error in  vendordb");
           next(errorHandler(500,"vendor not saved"));
        }else{
            return res.status(200).json(savedVendor)
        }
    } catch (error) {
        next(errorHandler(500,"somehow signup failed"));
    }
    
}

export const vendorSignin = async (req,res,next)=>{
    const {email,password} =req.body
    // console.log("signin req");
    // console.log(req.body);
    try {
        const vendor= await Vendor.findOne({email})
        // console.log(viewer);
        
       if(vendor){
        // console.log("found user");
        const isPasswordCorrect= await bcrypt.compare(password,vendor.password);
       
        if(isPasswordCorrect){
            // console.log("password matched");
            const token=jwt.sign({id:vendor._id},process.env.JWT_SECRET)
            
            const {password,...rest}=vendor._doc
           
            const expiryDate = new Date(Date.now()+3600000)
            return res.status(200).json({rest,message:"vendor login successful",token})
           }else{
            next(errorHandler(401,"Invalid password"))
        }   
    }else{
        next(errorHandler(401,"Invalid Credentials"))
    }
       
      } catch (error) {
        // res.status(401).json({message:"login denied"})
        next(errorHandler(401,"signin failed"))
    
       
      }
}

export const vendorList = async (req,res)=>{

    try {
        const vendorList= await Vendor.find()
        res.status(200).json(vendorList)
               
    } catch (error) {
        console.log(error.message);
    }
        // if(!newUser||newUser==undefined){
        //    console.log("Error in db");
        // }else{
        // }
    }

    export const vendorListing = async (req,res)=>{
        const type=req.params.type
        if(type=="theatre"){

            try {
                const vendorList= await Vendor.find({isTheatre:true,isAccess:"Allowed"})
                return    res.status(200).json(vendorList)
                
            } catch (error) {
                console.log(error.message);
                return   res.status(500).json(error)
            }
        }else{
            try {
                const vendorList= await Vendor.find({isTheatre:false,isAccess:"Allowed"})
                return   res.status(200).json(vendorList)
                
            } catch (error) {
                console.log(error.message);
             return   res.status(500).json(error)
            }

        }
            // if(!newUser||newUser==undefined){
            //    console.log("Error in db");
            // }else{
            // }
        }

    export const trendingList = async (req,res)=>{
        const type=req.params.type
       
        try {
            if(type=="Theatre"){

                const vendors= await Vendor.find({isTheatre:true})
               
               return res.status(200).json(vendors)
                
            }else{
                const vendors= await Vendor.find({isTheatre:false})
               return res.status(200).json(vendors)
                
            }
            
        } catch (error) {
            console.log("error from trending List");
            res.status(500).json(error.message)
        }
            // if(!newUser||newUser==undefined){
            //    console.log("Error in db");
            // }else{
            // }
        }

        export const vendorDetails = async (req,res,next)=>{
            const id=req.params.id
           
            try {
               
    
                    const vendorDatail= await Vendor.findOne({_id:id})
                    res.status(200).json({})
                                
            } catch (error) {
                console.log("error from vendorDetail");
                // next(errorHandler(500,"vendorDetails not fetched"));
            }
                // if(!newUser||newUser==undefined){
                //    console.log("Error in db");
                // }else{
                // }
            }
    export const vendorRegistration = async (req,res)=>{
const _id=req.params.id
const {displayPicture,thumbnail,email,houseNo,addresslineOne,addresslineTwo,landmark,postOffice,district,state,remark} =req.body
try {
    const newUser= await Vendor.findOneAndUpdate({_id},{$set:{displayPicture,thumbnail,address:{houseNo,addresslineOne,addresslineTwo,landmark,postOffice,district,state,remark}}})
        
        
    
} catch (error) {
    console.log(error.message);
}
    // if(!newUser||newUser==undefined){
    //    console.log("Error in db");
    // }else{
        res.status(200).json({success:true})
    // }
}

export const vendorFacilities = async (req,res)=>{
    console.log("req.body");
    console.log(req.body);
    const _id=req.params.id
    const featureName=req.body.featureName
    const featureDescription=req.body.featureDescription
    const featureFile=req.body.featurePic
    
    
    try {
        
        const obj= await Vendor.findByIdAndUpdate({_id},{$push:{features:{featureName,featureDescription,featureFile}}},{new:true})
        return res.status(200).json(obj)
        
    } catch (error) {
        console.log("cant update facilities");
       return res.status(500).json(error)
    }
    
}

export const vendorEatables = async (req,res)=>{
    const _id=req.params.id
    const item=req.body.eatableItem
    const description=req.body.eatableDescription
    const quantity=req.body.eatableQuantity
    const price=req.body.eatablePrice
    const image=req.body.eatablePic
    
   
    
    try {
        
        const obj= await Vendor.findByIdAndUpdate({_id},{$push:{eatables:{item,description,image,quantity,price}}},{new:true})
      return res.status(200).json(obj)
      
    } catch (error) {
        console.log("cant update eatables");
        return res.status(500).json({msg:"couldn't update eatables"})
    }
   
}

export const vendorTimings = async (req,res)=>{
    const _id=req.params.id
    const timings=req.body.selectedOption
    const slots=timings.map((opt)=> Number(opt.value))
    
        try {
            
            const obj= await Vendor.findOneAndUpdate({_id},{$set:{timeSlots:slots}},{new:true})
            res.status(200).json(obj)
        } catch (error) {
            console.log("timing error");
            console.log(error);
            res.status(500).json(error)
        }

  
}


export const vendorApproval = async (req,res)=>{
    const _id=req.params.id
     const vendor= await Vendor.findOne({_id})
     
     if(vendor.isAccess==="Not Allowed"){

            await Vendor.findOneAndUpdate({_id},{$set:{isAccess:"Allowed"}})
        }else if(vendor.isAccess==="Allowed"){
            await Vendor.findOneAndUpdate({_id},{$set:{isAccess:"Blocked"}})
   
        }else if(vendor.isAccess==="Blocked"){
            await Vendor.findOneAndUpdate({_id},{$set:{isAccess:"Not Allowed"}})
   
        }
       

   
    const obj=await Vendor.findOne({_id})
   res.status(200).json(obj)
}


// allowEdit

export const vendorEdit = async (req,res)=>{
    const _id=req.params.id
     const vendor= await Vendor.findOne({_id})
     
     if(vendor.isAccess==="Not Allowed"){

            await Vendor.findOneAndUpdate({_id},{$set:{isAccess:"Allowed"}})
        }else if(vendor.isAccess==="Allowed"){
            await Vendor.findOneAndUpdate({_id},{$set:{isAccess:"Blocked"}})
   
        }else if(vendor.isAccess==="Blocked"){
            await Vendor.findOneAndUpdate({_id},{$set:{isAccess:"Not Allowed"}})
   
        }
       

   
    const obj=await Vendor.findOne({_id})
   res.status(200).json(obj)
}


export const allowEdit= async (req, res, next) => {
    console.log("req.body");
    const store=req.body

    console.log(req.body);
   
    try {
        const user = await Vendor.findOne({_id:req.params.id})
      
    
      const updatedUser = await Vendor.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username:req.body.username || user.username,
            "address.houseNo": req.body.houseNo ||user.address.houseNo  ,
            "address.addresslineOne": req.body.addresslineOne ||user.address.addresslineOne ,
            "address.addresslineTwo": req.body.addresslineTwo ||user.address.addresslineTwo ,
            "address.postOffice": req.body.postOffice ||user.address.postOffice ,
            "address.district": req.body.district ||user.address.district ,
            "address.state": req.body.state ||user.address.state ,
            "address.remark": req.body.remark ||user.address.remark ,
            seatingCapacity:req.body.seatingCapacity||user.seatingCapacity,
            price:req.body.pricePerHour||user.price,
            displayPicture:req.body.displayPicture||user.displayPicture,
            thumbnailPic:req.body.thumbnailPic||user.thumbnailPic,
              }
        },
        { new: true }
      );
      const { password, ...rest } = updatedUser._doc;
      console.log("rest");
      console.log(rest);
    return  res.status(200).json(rest);
    } catch (error) {
      console.log("updationError");
      console.log(error);
    }
  };




export const prodDet= async (req,res,next)=>{
    const _id=req.params.id
    try {
        const vendorDetails= await Vendor.findOne({_id})
        res.status(200).json(vendorDetails)
}catch(err){
    res.status(403).json({mssg:"no matching id"})
}

}

export const signout = (req, res) => {
    res.clearCookie('access_token').status(200).json('Signout success!');
  };


  
  export const testing = (req, res) => {
    console.log("req.body");
    console.log(req.body);
  };

  
  function addMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
}


  
  export const subscribe =async (req, res) => {
    const product=req.body 
    console.log(product);
    const id=product.currentUser._id
    const subscriptionDate=product.currentUser.subscription

    const months=product.subAmt/50
   const newSub= addMonths(new Date(subscriptionDate),months)
    const name="subscription"
    // This is your test secret API key.
    const session = await stripeInstance.checkout.sessions.create({
     payment_method_types: ['card'], // Use 'payment_method_types' instead of 'payment_methods_types'
     line_items: [
       {
         price_data: {
           currency:"inr",
           product_data:{
             name:name
           },
           unit_amount:5000
         },
        quantity:months
       },
     ],
     mode: 'payment',
     success_url: `http://localhost:5173/profile`,
     cancel_url: `http://localhost:5173/checkoutFailure`,
   });
   console.log("session");
   console.log(session);

   const updatedUser = await Vendor.findByIdAndUpdate(
    id,
    {
      $set: {
       subscription:new Date(newSub),
       isAccess:"Allowed"
          }
    },
    { new: true }
  );

   res.json({id:session.id,total:session.amount_total,updatedUser});
  };

  export const putNotAllowed =async (req, res) => {
    const id=req.body.id
    const status="Allowed"
    const secondStatus="Not Allowed"
    const user=await Vendor.findById(
        {_id:id}
       
      )
      if(user.isAccess=="Allowed"){



          const updatedUser = await Vendor.findByIdAndUpdate(
              id,
              {
                $set: {
             
                 isAccess:"Not allowed"
                    }
              },
              { new: true }
            )
      }else if(user.isAccess=="Not allowed"){
        const updatedUser = await Vendor.findByIdAndUpdate(
            id,
            {
              $set: {
           
               isAccess:"Blocked"
                  }
            },
            { new: true }
          )
      }else {
        const updatedUser = await Vendor.findByIdAndUpdate(
            id,
            {
              $set: {
           
               isAccess:"Allowed"
                  }
            },
            { new: true }
          )
      }
      const vendors = await Vendor.find()
      res.json(vendors).status(200)

  }