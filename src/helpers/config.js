import db from '../db';

const isAutoDisburseActive = async () => {
  const config = await db.config.findOne({
    where: { key: 'Auto Disburse' },
    attributes: ['value'],
  });

  if (!config) {
    return false;
  }

  const { value } = config.dataValues;
  return (value === 'true');
};

const encryptCard = () => true;


export { isAutoDisburseActive, encryptCard };
