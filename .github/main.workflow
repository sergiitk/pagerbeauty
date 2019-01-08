workflow "Build Master" {
  on = "push"
  resolves = ["yarn"]
}

action "yarn" {
  uses = "borales/actions-yarn@master"
  args = "install --frozen-lockfile"
}
