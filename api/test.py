from common.database import database

# database.updateInfo("333", "凌泽楷", "18520775522")

a = database()
# print("!")
a.updateInfo("333", "凌泽楷", "18520775522")
print(a.getInfo("333"))