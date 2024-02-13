<template>
  <div class="row mt-4 justify-content-center">
    <div class="col-sm-12 col-md-12 col-lg-9">
      <ul class="nav nav-pills nav-justified mb-3" id="pills-tab" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Create Slots</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Manage Slots</button>
        </li>
      </ul>
      <div class="tab-content" id="pills-tabContent">
        <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-12">
                  <div class="row">
                    <div class="col-sm-12 col-md-12 col-lg-6">
                      <div class="mb-3">
                        <VueDatePicker :disabled-dates="disabledDates" :format="format" :enable-time-picker="false" :min-date="new Date()"
                                       @update:model-value="handleDate" :disabled-week-days="[6, 0]"
                                       v-model="date"></VueDatePicker>
                      </div>
                    </div>
                    <div class="col-sm-12 col-md-12 col-lg-6">
                      <div class="mb-3" v-if="date">
                        <button class="btn btn-dark w-100" type="button" @click="createSlots">Generate Slots</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12" v-if="slots.length">
                  <div class="row">
                    <div class="col-12 mb-2">
                      <h4>Slots for the day</h4>
                    </div>
                    <div class="col-sm-12 col-md-12 col-lg-3 my-2" v-for="slot in slots">
                      <span class="badge text-bg-secondary">{{ dateFormat(slot,'MMM,Do YYYY HH:mm A') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer" v-if="slots.length">
              <button class="btn btn-dark float-end" @click="saveSlots" type="button">Save Slots</button>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-12 mb-3">
                  <div class="mb-3">
                    <label class="mb-2">Select Date</label>
                    <select class="form-control" @change="handleDateUpdate($event.target.value)">
                      <option value="0">Select Date</option>
                      <option v-if="disabledDates.length" v-for="date in disabledDates" :value="date">{{ dateFormat(date,'MMM,Do YYYY') }}</option>
                    </select>
                  </div>
                </div>
                <div class="col-12" v-if="dbSlots.length">
                  <div class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                      <tr>
                        <th scope="col">Slot Time</th>
                        <th scope="col">Disabled</th>
                        <th scope="col">Booked By</th>
                        <th scope="col">Action</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="dbSlot in dbSlots">
                        <th scope="row">{{ dbSlot.slot_time }}</th>
                        <td>
                          <span class="badge text-bg-success" v-if="dbSlot.disabled === 0 && dbSlot.booked_by === null">No</span>
                          <span class="badge text-bg-danger" v-if="dbSlot.disabled === 1 && dbSlot.booked_by === null">Yes</span>
                          <span class="badge text-bg-info" v-if="dbSlot.booked_by !== null">NA</span>
                        </td>
                        <td>
                          <p v-if="dbSlot.booked_by === null">NA</p>
                          <p v-if="dbSlot.booked_by !== null">{{ dbSlot.customer.full_name }}</p>
                        </td>
                        <td>
                          <button v-if="dbSlot.disabled === 0 && dbSlot.booked_by === null" class="btn btn-danger btn-sm" @click="updateSlot(dbSlot.id,1)" type="button">Disable</button>
                          <button v-if="dbSlot.disabled === 1 && dbSlot.booked_by === null" class="btn btn-success btn-sm" @click="updateSlot(dbSlot.id,0)" type="button">Enable</button>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import axios from "@/axios";
import moment from 'moment';

export default {
  components: {VueDatePicker},
  data() {
    return {
      date: null,
      slots: [],
      disabledDates:[],
      dbSlots:[],
      selectedDate:null
    };
  },
  created() {
    this.fetchCurrentMonthData(new Date());
  },
  methods: {
    format(date) {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
      let year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    handleDate(modelData) {
      this.date = modelData;
      this.slots = [];
    },
    async createSlots() {
      let response = await axios.post('/create-slots', {date: this.format(this.date)}).then(success => {
        this.slots = success.data.data.slots;
      });
    },
    dateFormat(slot,format) {
      return moment(slot).format(format);
    },
    async saveSlots() {
      let response = await axios.post('/save-slots', {slots: this.slots}).then(success => {
        this.$router.push('/');
      });
    },
    async fetchCurrentMonthData(date) {
      let response = await axios.post('/get-slot-data', {date: date}).then(success => {
        this.disabledDates = success.data.data.dates;
      });
    },
    async handleDateUpdate(value){
      this.selectedDate = value;
      if(value === '0'){
        this.dbSlots = [];
        return;
      }
      this.dbSlots = [];
      let response = await axios.post('/get-slots-by-date', {date: value}).then(success => {
        this.dbSlots = success.data.data.slots;
      });
    },
    async updateSlot(slotId,status){
      let response = await axios.post('/update-slot-status', {slot_id: slotId,status:status}).then(success => {
        this.handleDateUpdate(this.selectedDate);
      });
    }
  }
}
</script>
<style>
.nav-pills .nav-link.active, .nav-pills .show>.nav-link{
  background-color: #212529;
}
.nav-link{
  color: #9d9d9d !important;
}
</style>