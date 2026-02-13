

interface UserData {
  Username:string,
  Password:string
}
export const Card=(props:UserData)=>{
  const details = props.Username
  return( 
    <>
    <div className="space-y-4">User Details:{details}</div>
    </>
  )
}

export default function Home()
{
  return (
    <>
    <div className="main  p-6 border border:1px solid green">
      Home Page

    </div>
    </>
  )
}