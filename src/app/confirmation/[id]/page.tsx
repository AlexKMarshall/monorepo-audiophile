export default function ConfirmationPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div>
      <h1>Confirmation Page {params.id} </h1>
    </div>
  )
}
