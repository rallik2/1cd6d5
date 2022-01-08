user = User.create!(email: "test@test.com", password: "sample")
user2 = User.create!(email: "test2@test.com", password: "sample2")


for i in 1..3 do
    campaign = user.campaigns.create!(name: "Awesome Campaign #{i}")
    for j in 1..100 do
        l = j + ((i-1) * 100)
        prospect = user.prospects.create!(
            email: "target#{l}@example.com",
            first_name: "Name#{l}",
            last_name: "Mc#{l}"
        )
        campaign.prospects << prospect
    end
end