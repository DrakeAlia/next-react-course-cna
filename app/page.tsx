import Link from "next/link";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!);

type Quiz = {
  quiz_id: number;
  title: string;
};

async function Quizzes() {
  const quizzes: Quiz[] = await sql`
  SELECT * FROM quizzes
  `;

  return (
    <ul>
      {quizzes.map((quiz) => (
        <li key={quiz.quiz_id}>
          <Link href={`/quiz/${quiz.quiz_id}`}>{quiz.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <section>
      <h1>All Quizzes</h1>
      <Quizzes />
    </section>
  );
}
