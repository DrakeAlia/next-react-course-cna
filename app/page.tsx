import Link from "next/link";
import postgres from "postgres";
import QuizForm from "./quiz-form";

const sql = postgres(process.env.POSTGRES_URL!);

type Quiz = {
  quiz_id: number;
  title: string;
};

async function Quizzes() {
  const quizzes: Quiz[] = await sql`
  SELECT * FROM quizzes
  `;
  // console.log(quizzes);

  return (
    <ul>
      {quizzes.map((quiz) => (
        <li key={quiz.quiz_id} className="underline">
          <Link href={`/quiz/${quiz.quiz_id}`}>{quiz.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <section className="flex flex-col items-center text-center mt-2 py-5 mx-auto">
      <h1 className="text-2xl font-bold p-2 mb-4">All Quizzes</h1>
      <Quizzes />
      <QuizForm />
    </section>
  );
}
