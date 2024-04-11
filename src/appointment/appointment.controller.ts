import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}


  @Get('doctor/:doctorId/date/:date')
  getAppointmentsForDoctorOnDate(
    @Param('doctorId') doctorId: string,
    @Param('date') date: Date,
  ): Promise<Appointment[]> {
    const parsedDate = new Date(date);
    return this.appointmentService.getAppointmentsForDoctorOnDate(doctorId, parsedDate);
  }
  @Post()
  async bookAppointment(@Body() createAppointmentDto: CreateAppointmentDto){
    return this.appointmentService.bookAppointment(createAppointmentDto);
  }

  @Post()
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto){
    
    return this.appointmentService.bookAppointment(createAppointmentDto);
  }

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
