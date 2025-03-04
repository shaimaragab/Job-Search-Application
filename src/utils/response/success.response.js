export const successResponse = ({res,status=200,data={},message="done"}={})=>{
    return res.status(status).json({message:message,data:{...data}})
}