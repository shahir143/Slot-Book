const meet=require('../model/meet');
const slots=require('../model/slot');

//fetch all the slot timings
exports.getMeetings= async(req,res,next)=>{
    try{
        const dbData = await meet.findAll()
        res.status(201).json(dbData);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

//saving the booked slot
exports.saveSlot = async (req, res, next) => {
    console.log(res.body);
    try {
        const slotData = await slots.create({
            name: req.body.name,
            email: req.body.email,
            time: req.body.time,
            meetId: req.body.meetId,
        });

        const meettime = await meet.findByPk(slotData.meetId);

        if (meettime) {
            const oldData = meettime.slotsAvail;
            
            if (oldData > 0) {
                meettime.slotsAvail = oldData - 1;
                await meettime.save();
            }
        } else {
            return res.status(404).json({ message: 'Meeting not found.' });
        }
        res.status(200).json(slotData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

//fetching all the slots
exports.getSlots= async(req,res,next)=>{
    const meetId=req.params.id;
    try{
        const dbData=await slots.findAll({where :{meetId:meetId}});
        const data = dbData.map(data => data.dataValues);
        res.status(201).json(data);
    }catch(err){
        res.status(500).json({message:err.message});
    }
}

//delete slot from the slot database
exports.deleteSlot = async (req, res, next) => {
    const id = req.params.id;

    try {
        const slotData = await slots.findByPk(id);

        if (!slotData) {
            return res.status(404).json({ message: 'Slot not found.' });
        }

        const slotMeet = slotData.meetId;

        const meettime = await meet.findByPk(slotMeet);

        if (!meettime) {
            return res.status(404).json({ message: 'Meeting not found.' });
        }

        const oldData = meettime.slotsAvail;
        let updatedSlots = oldData + 1;

        meettime.slotsAvail = updatedSlots;
        await meettime.save();

        const deletedSlot = await slots.destroy({ where: { id: id } });

        res.status(200).json({ message: 'Slot deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};