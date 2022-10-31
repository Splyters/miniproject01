defmodule ApiProjectWeb.TeamController do
  require Logger
  use ApiProjectWeb, :controller
  alias ApiProject.Team

  def read(conn, %{"teamId" => team_id}) do
    team = Team.get_team!(team_id)

    if team do
      render(conn, "team.json", team: team)
    else
      conn
      |> put_status(404)
      |> render("error.json", reason: "Team does not exist")
    end
  end

  def list_team_users(conn, %{"teamId" => team_id}) do
    users = Team.get_team_users(team_id)
  end

  def create(conn, %{"team" => team_params}) do
    with {:ok, %Team{} = team} <- Team.create_team(team_params) do
      render(conn, "team.json", team: team)
    else
      {:error, %Ecto.Changeset{}} ->
        conn
        |> put_status(400)
        |> render("error.json", reason: "The payload does not match the expected value")
    end
  end

  def update(conn, %{"teamId" => team_id, "team" => team_params}) do
    team = Team.get_team(team_id)

    if team do
      with {:ok, %Team{} = updated} <- Team.update_team(team, team_params) do
        render(conn, "team.json", team: updated)
      else
        {:error, %Ecto.Changeset{}} ->
          conn
          |> put_status(400)
          |> render("error.json", reason: "The payload does not match the expected value")
      end
    else
      conn
      |> put_status(404)
      |> render("error.json", reason: "The requested user does not exist")
    end
  end

  def delete(conn, %{"teamId" => team_id}) do
    team = Team.get_team(team_id)

    if(team) do
      with {:ok, deleted} <- Team.delete_team(team) do
        send_resp(conn, 204, "")
      else
        {:error, %Ecto.Changeset{}} ->
          conn
          |> put_status(418)
          |> render("error.json", reason: "An error has occured 🫖")
      end
    else
      conn
      |> put_status(404)
      |> render("error.json", reason: "The requested team does not exist")
    end
  end
end
