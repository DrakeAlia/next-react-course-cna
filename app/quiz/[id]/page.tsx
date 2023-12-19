import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!);

async function Quiz({ id }: { id: string }) {
  const quiz = await sql`
  SELECT * FROM quizzes WHERE quiz_id = ${id}
  `;

  return (
    <div>
      <h1>{quiz[0].title}</h1>
    </div>
  );
}

export default function QuizPage({ params }: { params: { id: string } }) {
  return (
    <section>
      <Quiz id={params.id} />
    </section>
  );
}
