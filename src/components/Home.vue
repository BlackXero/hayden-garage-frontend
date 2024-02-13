<template>
  <div class="row mt-4">
    <div class="col-12">
      <div class="card">
        <div class="card-header bg-dark">
          <div class="d-flex justify-content-between">
            <div class="card-title text-white">
              <h4>Bookings</h4>
            </div>
            <div class="w-25">
              <select class="form-select" aria-label="Default select example"
                      @change="getBookings($event.target.value)">
                <option value="0">Select date</option>
                <option v-if="dates.length" v-for="date in dates" :value="date">{{ date }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="card-body text-center" v-if="bookings.length === 0">
          <h5 class="text-danger">No Booking</h5>
        </div>
        <div class="card-body" v-if="bookings.length">
          <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-6" v-for="booking in bookings">
              <div class="card mb-3">
                <div class="card-header bg-dark-subtle">{{ booking.customer.full_name }}</div>
                <div class="card-body">
                  <h5 class="card-title"></h5>
                  <p><span><strong>Phone:</strong></span> {{ booking.customer.phone }}</p>
                  <p><span><strong>Date:</strong></span> {{ dateFormat(booking.slot_date, 'MMM,Do YYYY') }}</p>
                  <p><span><strong>Time:</strong></span> {{ booking.slot_time }}</p>
                  <p><span><strong>Vehicle Make:</strong></span> {{ booking.booking.vehicle.title }}</p>
                  <p><span><strong>Vehicle Model:</strong></span> {{ booking.booking.model.title }}</p>
                  <p></p>
                  <p></p>
                  <p></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "@/axios";
import moment from 'moment';

export default {
  data() {
    return {
      bookings: [],
      dates: [],
    };
  },
  created() {
    let date = moment(new Date()).format('YYYY-MM-DD');
    //date = '2024-05-02';
    this.getBookings(date);
  },
  methods: {
    async getBookings(date) {
      if (date === '0') {
        date = moment(new Date()).format('YYYY-MM-DD');
      }
      this.bookings = [];
      let response = await axios.post('/get-bookings', {date: date}).then(success => {
        this.bookings = success.data.data.bookings;
        this.dates = success.data.data.dates;
      });
    },
    dateFormat(slot, format) {
      return moment(slot).format(format);
    }
  }
}
</script>