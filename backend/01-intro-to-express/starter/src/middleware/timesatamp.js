    export default function timestamp(req, res, next) {
        // Check if the request method is POST
        if(req.method==='POST'){
            // Add createdAt timestamp to the request body for new resources
            req.body.createdAt=new Date().toISOString();
            // Add updatedAt timestamp to the request body for new resources
            req.body.updatedAt=new Date().toISOString();
        // Check if the request method is PUT
        }else if(req.method==='PUT'){
            // Update the updatedAt timestamp in the request body for existing resources
            req.body.updatedAt=new Date().toISOString();
        }
        // Call the next middleware function in the stack to continue request processing
        next();
    }
    