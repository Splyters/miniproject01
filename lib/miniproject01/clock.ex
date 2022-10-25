defmodule ApiProject.Clock do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query, warn: false
  alias ApiProject.Repo
  alias ApiProject.Clock

  schema "clocks" do
    field(:status, :boolean, default: true)
    field(:time, :naive_datetime)
    field(:user, :id)

    timestamps()
  end

  @doc false
  def changeset(clock, attrs) do
    clock
    |> cast(attrs, [:time, :status])
    |> validate_required([:time, :status])
  end

  def create(attrs \\ %{}) do
    %Clock{}
    |> Clock.changeset(attrs)
    |> Repo.insert()
    |> case do
      {:ok, clock} -> {:ok, clock}
      {:error, _} -> :error
    end
  end
end
