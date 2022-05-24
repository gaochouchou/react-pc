import { http } from "@/utils"
import { makeAutoObservable } from "mobx"

class ChannelStore {
  channel = []
  constructor() {
    makeAutoObservable(this)
  }

  getChannelList = async () => {
    const res = await http.get('/channels')
    this.channel = res.data.channels
  }

}

export default ChannelStore