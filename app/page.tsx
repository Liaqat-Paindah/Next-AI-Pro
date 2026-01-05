

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
  const data = {Username:"Liaqat Paindah", Password:"admin123"}
  return (
    <>
    <div className="main bg-gray-200 p-6 border border:1px solid green">
      Home Page
      <Card Username={data.Username} Password={data.Password}></Card>

    </div>
    </>
  )
}