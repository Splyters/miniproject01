defmodule ApiProject.Repo.Migrations.CreateWorkingtimes do
  use Ecto.Migration

  def change do
    create table(:working_times) do
      add(:start, :naive_datetime, null: false)
      add(:end, :naive_datetime, null: false)
      add(:user_id, references(:users))

      timestamps()
    end

  end
end
