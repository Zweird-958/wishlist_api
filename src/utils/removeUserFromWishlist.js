import { prisma } from "../../app"

const removeUserFromWishlist = async (receiver, user) => {
  const receiverUpdated = await prisma.user.update({
    where: {
      email: receiver.email,
    },
    data: {
      wishlistShared: {
        set: receiver.wishlistShared.filter((id) => id !== user.id),
      },
    },
  })

  return receiverUpdated
}

export default removeUserFromWishlist
