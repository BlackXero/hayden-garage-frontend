<template>
  <div class="row mt-4">
    <div class="col-12">
      <div class="card my-4">
        <div class="card-header bg-dark">
          <div class="card-title text-white">
            <h4>Create Booking</h4>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-3">
              <div class="mb-2">
                <label>First Name</label>
                <input type="text" class="form-control" @input="setValue($event.target.value,'first_name','text')"
                       id="first_name" ref="first_name">
              </div>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-3">
              <div class="mb-2">
                <label>Last Name</label>
                <input type="text" class="form-control" @input="setValue($event.target.value,'last_name','text')"
                       id="last_name" ref="last_name">
              </div>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-3">
              <div class="mb-2">
                <label>Email</label>
                <input type="email" class="form-control" @input="setValue($event.target.value,'email','text')"
                       id="email" ref="email">
              </div>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-3">
              <div class="mb-2">
                <label>Phone No.</label>
                <input
                    oninput="if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    type="number"
                    maxlength="10" class="form-control" @input="setValue($event.target.value,'phone','text')" id="phone"
                    ref="phone">
              </div>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-4">
              <div class="mb-2">
                <label>Vehicle Make</label>
                <select class="form-select" @change="selectedVehicleMake"
                        @input="setValue($event.target.value,'make_id','select')" id="make_id" ref="make_id">
                  <option value="0">Select</option>
                  <option v-if="vehicleMake.length" :value="make.id" v-for="make in vehicleMake">{{
                      make.title
                    }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-4">
              <div class="mb-2">
                <label>Vehicle Model</label>
                <select class="form-select" :disabled="hasMake"
                        @input="setValue($event.target.value,'model_id','select')" id="model_id" ref="model_id">
                  <option>Select</option>
                  <option v-if="vehicleModel.length" :value="model.id" v-for="model in vehicleModel">{{
                      model.title
                    }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-4">
              <div class="mb-2">
                <label>Booking Date</label>
                <VueDatePicker :model-value="date" :allowed-dates="enabledDates" :format="format"
                               :enable-time-picker="false" :min-date="new Date()"
                               @update:model-value="handleDate" :disabled-week-days="[6, 0]"
                               v-model="date"></VueDatePicker>
              </div>
            </div>
            <div class="col-12" v-if="noSlot">
              <div class="alert alert-danger" role="alert">
                Slot is required!!
              </div>
            </div>
          </div>
          <div class="row mt-5" v-if="slots.length">
            <div class="col-12">
              <h4>Available Slots for <span class="badge bg-secondary">{{ dateFormat(date, 'MMM,Do YYYY') }}</span></h4>
            </div>
            <div class="col-12">
              <div class="table-responsive">
                <table class="table table-bordered table-sm">
                  <thead>
                  <tr>
                    <th scope="col">Slot Time</th>
                    <th scope="col">Booked By</th>
                    <th scope="col">Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="slot in slots" v-bind:class="(slot.booked_by !== null || slot.disabled) ? 'table-secondary' : ''">
                    <th scope="row" class="align-middle">{{ slot.slot_time }}</th>
                    <td class="align-middle">
                      <p v-if="slot.booked_by === null">NA</p>
                      <p v-if="slot.booked_by !== null">{{ slot.customer.full_name }}</p>
                    </td>
                    <td class="align-middle">
                      <div class="form-check" v-if="slot.booked_by === null && !slot.disabled">
                        <input class="form-check-input" type="radio" name="slot" :id="slot.id"
                               @input="setValue(slot.id,'slot_id','radio')">
                        <label class="form-check-label" :for="slot.id">
                          Select
                        </label>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-dark float-end" type="button" @click="saveBooking">Book</button>
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
      enabledDates: [],
      dbSlots: [],
      vehicleMake: [],
      vehicleModel: [],
      hasMake: true,
      noSlot: false,
      booking: {
        first_name: null,
        last_name: null,
        email: null,
        phone: null,
        make_id: null,
        model_id: null,
        slot_id: null
      }
    };
  },
  created() {
    this.fetchCurrentMonthData(new Date());
  },
  methods: {
    setValue(event, key, type) {
      if (type === 'select') {
        if (event === '0') {
          this.booking.make_id = null;
          this.booking.model_id = null;
          return;
        }
      }
      this.booking[key] = event;
    },
    format(date) {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
      let year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    async handleDate(modelData) {
      this.slots = [];
      this.booking.slot_id = null;
      if (null === modelData) {
        return;
      }
      let response = await axios.post('/get-slots-by-date', {date: modelData}).then(success => {
        this.slots = success.data.data.slots;
      });
    },
    dateFormat(slot, format) {
      return moment(slot).format(format);
    },
    async fetchCurrentMonthData(date) {
      let response = await axios.post('/get-slot-data', {date: date}).then(success => {
        this.enabledDates = success.data.data.dates;
      });
      let responseTwo = await axios.post('/get-vehicle-make', {date: date}).then(success => {
        this.vehicleMake = success.data.data.make;
      });
    },
    async selectedVehicleMake(event) {
      let value = event.target.value;
      this.vehicleModel = [];
      this.hasMake = true;
      if (value === '0') {
        return;
      }
      let responseTwo = await axios.post('/get-vehicle-model', {make: value}).then(success => {
        this.vehicleModel = success.data.data.model;
        this.hasMake = false;
      });
    },
    async saveBooking() {
      let hasError = false;
      for (let i in this.booking) {
        if (this.$refs[i] && this.booking[i] === null) {
          this.$refs[i].classList.remove('is-invalid');
          this.$refs[i].classList.add('is-invalid');
          hasError = true;
        }
        if (this.$refs[i] && this.booking[i] !== null) {
          this.$refs[i].classList.remove('is-invalid');
        }
      }
      if (this.booking.slot_id === null) {
        this.noSlot = true;
        hasError = true;
      } else {
        this.noSlot = false;
      }
      if (hasError) {
        this.$swal('Error in booking.');
        return;
      }
      let responseTwo = await axios.post('/save-booking', this.booking).then(success => {
        this.$router.push('/');
      });
    }
  }
}
</script>