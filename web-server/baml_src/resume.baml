class StakeComment {
  amount float
  issue_number int?
}


function ExtractStakeComment(user_comment: string) -> StakeComment {
  client CustomSonnet
  prompt #"

  Extract the amount from the user comment
  {{user_comment}}

  {{ ctx.output_format }}
  "#
}

test Test1{
  functions [ExtractStakeComment]
  args{
    user_comment "I want to stake 1000 dollars on Issue #19"
  }
}

test Test2{
  functions [ExtractStakeComment]
  args{
    user_comment "I want to stake 1000 dollars"
  }
}