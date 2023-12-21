import { revalidatePath } from "next/cache";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!);

function Answer({ id }: { id: number }) {
  return (
    <label>
      Answer {id}:
      <input
        className="bg-gray-500 border-2 border-gray-50 hover:bg-blue-400 p-1 rounded w-full"
        type="text"
        name={`answer-${id}`}
      />
      <input type="checkbox" name={`check-${id}`} />
    </label>
  );
}

export default function QuizForm() {
  async function createQuiz(formData: FormData) {
    "use server";
    let title = formData.get("title") as string;
    let description = formData.get("description") as string;
    let question = formData.get("question") as string;
    let answers = [1, 2, 3].map((id) => {
      return {
        answer: formData.get(`answer-${id}`) as string,
        isCorrect: formData.get(`check-${id}`) === "on",
      };
    });

    // console.log({ title, description, question, answers });

    await sql`
        WITH new_quiz AS (
            INSERT INTO quizzes (title, description, question_text, 
            created_at)
            VALUES (${title}, ${description}, ${question}, NOW())
            RETURNING quiz_id
        )
        INSERT INTO answers (quiz_id, answer_text, is_correct)
        VALUES
            ( (SELECT quiz_id FROM new_quiz), ${answers[0].answer}, 
            ${answers[0].isCorrect}),
            ( (SELECT quiz_id FROM new_quiz), ${answers[1].answer}, 
            ${answers[1].isCorrect}),
            ( (SELECT quiz_id FROM new_quiz), ${answers[2].answer}, 
            ${answers[2].isCorrect})
    `;

    revalidatePath("/");
  }

  return (
    <form className="flex flex-col p-2 mt-8 max-w-xs" action={createQuiz}>
      <h3 className="text-lg font-bold text-center">Create Quiz</h3>
      <label className="mt-2">
        Title:
        <input
          className="bg-gray-500 border-2 border-gray-200 hover:bg-blue-400 rounded p-1 mt-2 w-full"
          type="text"
          name="title"
        />
      </label>
      <label>
        Description:
        <input
          className="bg-gray-500 border-2 border-gray-200 hover:bg-blue-400 rounded p-1 mt-2 w-full"
          type="text"
          name="description"
        />
      </label>
      <label>
        Question:
        <input
          className="bg-gray-500 border-2 border-gray-200 hover:bg-blue-400 rounded p-1 mt-2 w-full"
          type="text"
          name="question"
        />
      </label>
      <div className="my-4" />
      <Answer id={1} />
      <Answer id={2} />
      <Answer id={3} />
      <button
        type="submit"
        className="bg-gray-500 border-2 border-gray-200 hover:bg-blue-700 rounded p-2 mt-4 w-full transition-all"
      >
        Create Quiz
      </button>
    </form>
  );
}
