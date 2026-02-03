export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
};

export const usersData: User[] = [
  {
    id: 1,
    name: "Ahmad",
    email: "ahmad@test.com",
    role: "admin",
  },
  {
    id: 2,
    name: "Fatima",
    email: "fatima@test.com",
    role: "user",
  },
  {
    id: 3,
    name: "Omar",
    email: "omar@test.com",
    role: "user",
  },
];
