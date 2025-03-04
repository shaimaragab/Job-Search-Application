import multer from "multer"
export const fileValidationTypes= {
 image:['image/png', 'image/jpeg', 'image/jpg'],
 document:['application/pdf','application/json','text/plain'],
 imageOrDocument:['image/png', 'image/jpeg', 'image/jpg','application/pdf','application/json','text/plain']
}

export const uploadCloudFile=(fileValidation)=>{
    
    const storage = multer.diskStorage({ })//save file in temp folder
    function fileFilter(req,file,cb){
        console.log(file.mimetype);
        
        if (fileValidation.includes(file.mimetype) ) {
            cb(null,true);
        
        } else {
            cb('invaild file format', false);
        }
    }
    return multer({dest:"dest",fileFilter,storage})//object
}
