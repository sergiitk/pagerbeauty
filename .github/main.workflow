workflow "Build Master" {
  on = "push"
  resolves = ["yarn"]
}

action "Filters for GitHub Actions" {
  uses = "actions/bin/filter@b2bea0749eed6beb495a8fa194c071847af60ea1"
  args = "branch master"
}

action "yarn" {
  uses = "borales/actions-yarn@master"
  needs = ["Filters for GitHub Actions"]
  args = "install --frozen-lockfile"
}
