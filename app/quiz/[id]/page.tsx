import { redirect } from "next/navigation";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!);

async function Quiz({
  id,
  searchParams,
}: {
  id: string;
  searchParams: { show?: string };
}) {
  let answers = await sql`
  SELECT
    q.quiz_id,
    q.title AS quiz_title,
    q.description AS quiz_description,
    q.question_text AS quiz_question,
    a.answer_id,
    a.answer_text,
    a.is_correct
  FROM quizzes AS q
  JOIN answers AS a ON q.quiz_id = a.quiz_id
  WHERE q.quiz_id = ${id};
  `;

  return (
    <div className="flex flex-col text-center items-center mt-3">
      <h1 className="text-4xl font-bold p-4">{answers[0].quiz_title}</h1>
      <p className="text-2xl text-indigo-500 mb-4">
        {answers[0].quiz_description}
      </p>
      <p className="text-xl font-semibold mb-8">{answers[0].quiz_question}</p>
      <ul>
        {answers.map((answer) => (
          <li key={answer.answer_id}>
            <p className="text-yellow-300 p-2">
              {answer.answer_text}
              {searchParams.show === "true" && answer.is_correct && " ✅"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function QuizPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { show?: string };
}) {
  return (
    <section className="flex flex-col items-center">
      <Quiz id={params.id} searchParams={searchParams} />
      <form
        action={async () => {
          "use server";
          redirect(`/quiz/${params.id}?show=true`);
        }}
      >
        <button className="bg-gray-500 border-2 border-gray-200 hover:bg-blue-700 rounded p-2 mt-8 transition-all">
          Show Answer
        </button>
      </form>
    </section>
  );
}
