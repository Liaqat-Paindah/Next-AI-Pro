import { auth } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";
import User from "@/models/User";

export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?._id) return null;

  const user = await User.findOne({
    _id: new ObjectId(session.user._id),
  }).lean();
  if (!user) return null;

  return user;
}
